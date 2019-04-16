# common

> 微信小程序通用API封装

## 目录结构

```
├── common
│   ├── css
│   │   └── common.wxss     //通用css
│   │ 
│   └── js
│       ├── common.js       //集成其他js功能 以及 封装部分微信API
│       ├── cache.js        //缓存功能
│       ├── debounce.js     //函数防抖
│       ├── throttle.js     //函数节流
│       ├── event.js        //事件功能
│       ├── userInfo.js     //用户功能
│       ├── www.js          //域名配置
│       └── wxPayment.js    //封装微信支付
│
├── pages
│   └── login               //示例登录页
│       ├── login.js        
│       └── ...
│
├── app.js                  //示例app登录
└── ...

# 将目录中文件拷贝至项目根目录

```


##app.js登录 (若只考虑在实际场景中应用登录,请直接往下看登录场景)
```
登录功能配合userInfo.js使用,在顶部引入userInfo
import userInfo from './common/js/userInfo'
```

### 函数说明

####init(config){...} 初始化登录信息
```
config 配置参数,对象类型,可为空
包含字段:
     字段名        类型     默认值      说明
    authLogin    Boolean   false   未授权是否强制到登录页进行授权
    waitAuth     Boolean   false   是否等待用户授权后再登录
```

####authLogin(valid){...} 跳转到授权页面
```
//此函数建议配合防抖使用,防止短时间内多次调用导致多次跳转.在页面顶部引入throttle
import throttle from "./common/js/throttle";

//强制跳转功能需在对应页面写入逻辑,示例中的login.js已内置此功能

valid  //强制跳转? 若该值为true,若用户未进行授权, 也会立即跳转回登录页
```

####doLogin(wxUser){...} 登录操作(对接接口写在此处)
```
//此函数不需要手动调用,init后会自动调用此接口

 doLogin(wxUser) {
        let code = userInfo.code;
        console.log(wxUser);
        console.log('doLogin', {code, wxUser});
        /**
         * code     // wx.login  返回的code
         * wxUser   // 若 init 时的 waitAuth 为 true 此处为用户授权后的数据
         *          // 若 init 时的 waitAuth 为 false 则wxUser 为空
         */
        
        /**
         * 这里为登录接口对接,此处用定时器模拟异步登录
         * 可以将自己的后代登录口对接写在此处
         * 获取到服务器响应的用户数据后,需调用userInfo.setUserInfo
         */
        
        setTimeout(()=>{
            const user = {openid:'666666'};
            /**
             * 调用 setUserInfo 后,全局的getUserInfo都会得到响应,
             */
            userInfo.setUserInfo(user)
        },1000)
        
    },

```

### 登录场景

####授权方式
````
//------使用示例的login.js---------------

//你什么也不必做,只需要在想要发起授权的地方(例如购物车)调用app.authLogin()就可以了
//如果你init时的authLogin为true, 会自动发起一次app.authLogin(true)

//若你没有使用示例的login.js,那就在你的授权按钮回调中调用userInfo.setWxUserInfo()传入你的授权数据,在调用userInfo.init()后;一样会自动调用app.doLogin();

````

#####登录只需要code (不需要用户授权登录)

````
//app.js-应用配置
import userInfo from './common/js/userInfo' //引入userInfo

//复制示例中的3个函数至app.js
init(){...}
authLogin(){...}
doLogin(){...}

//app.onLaunch  中调用init
this.init()  //init后会自动调用doLogin

//在doLogin中写入自己对接后端的登录逻辑
//在doLogin中直接获取userInfo.code 就可以对接后端的登录接口了
//登录成功后调用userInfo.setUserInfo()传入你要储存的用户数据

//home.js 其他页面
import userInfo from './common/js/userInfo' //引入userInfo
//在onLoad中使用getUserInfo获取用户数据
userInfo.getUserInfo().then(userInfo=>{
    
    console.log(userInfo) //这里就可以获取到你储存的用户数据
    
    ... //这里就可以直接使用了
})


````

#####登录即需要code 也需要用户授权,而且需要用户在应用启动时就授权

````
//app.js-应用配置
import userInfo from './common/js/userInfo' //引入userInfo

//复制示例中的3个函数至app.js
init(){...}
authLogin(){...}
doLogin(){...}

//app.onLaunch  中调用init
this.init({waitAuth:true,authLogin:true})  //init后会自动调用doLogin

//在doLogin中写入自己对接后端的登录逻辑
//在doLogin中直接获取userInfo.code 
//doLogin 的第一个参数就是用户的授权数据
//使用code 和 授权数据 对接后端的登录接口
//登录成功后调用userInfo.setUserInfo()传入你要储存的用户数据

//home.js 其他页面
import userInfo from './common/js/userInfo' //引入userInfo
//在onLoad中使用getUserInfo获取用户数据
userInfo.getUserInfo().then(userInfo=>{
    
    console.log(userInfo) //这里就可以获取到你储存的用户数据
    
    ... //这里就可以直接使用了
})

//与上一个差不多,不过init时多传一个authLogin 强制跳转到登录页就好了
````


#####登录即需要code 也需要用户授权,但是不需要用户立即授权,而是在需要的时候发起授权,再去后端登录
//比如商城的首页,单纯的数据展示,不需要用户授权

````
//app.js-应用配置
import userInfo from './common/js/userInfo' //引入userInfo

//复制示例中的3个函数至app.js
init(){...}
authLogin(){...}
doLogin(){...}

//app.onLaunch  中调用init
this.init({waitAuth:true})  //init后会自动调用doLogin

//在doLogin中写入自己对接后端的登录逻辑
//在doLogin中直接获取userInfo.code 
//doLogin 的第一个参数就是用户的授权数据
//使用code 和 授权数据 对接后端的登录接口
//登录成功后调用userInfo.setUserInfo()传入你要储存的用户数据

//cart.js  --示例购物车页面
import userInfo from './common/js/userInfo' //引入userInfo
const app = getApp();
Page({
    ...
    onLoad(){
       if(!userInfo.getUserInfo(true))//若是用户未登陆
        app.authLogin(true) //强制跳转授权
        
       userInfo.getuserInfo.then(u=>this.getCartData(u));
    },
    getCartData(userInfo){
        //这里就可以用userInfo去获取购物车数据了    
    }
})

````
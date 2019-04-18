import throttle from "./js/throttle";

import userInfo from 'wx-mini-program-user'

//app.js
App({
    onLaunch: function () {

        const authLogin = false; //未授权强制到登录页进行授权
        const waitAuth = true;   //等待用户授权后登录
        this.init({authLogin, waitAuth});
    },

    /**
     * init 初始化用户
     */
    init({authLogin = false, waitAuth = false} = {}) {
        userInfo.init().then(([login, wxU]) => {
            console.log(login,wxU);
            if (authLogin && !wxU)
                this.authLogin(true);//跳转到登录页

            /**
             * 当用户授权时执行登录操作
             */
            waitAuth ?
                userInfo.getWxUserInfo().then(this.doLogin) :
                this.doLogin();


        },err=>{
            console.log(err);
        })
    },

    /**
     * 跳转授权登录页
     * throttle防止多次调用导致多次跳转
     */
    authLogin: throttle(function (valid = false) {
        console.log('go login');
        // 跳转授权页面
        wx.navigateTo({
            url: "/pages/login/login?valid=" + valid
        });
    }, 1000),

    /**
     * 执行用户登录
     */
    doLogin(wxUser) {
        let code = userInfo.code;
        console.log(wxUser);
        console.log('doLogin', {code, wxUser});
        /**
         * code     // wx.login  返回的code
         * wxUser   // 若init时的waitAuth 为 true 此处为用户授权后的数据
         *          // 若init时的waitAuth 为 false 则wxUser 为空
         */

        /**
         * 这里为登录接口对接,此处用定时器模拟异步登录
         */

        setTimeout(()=>{
            const user = {openid:'666666'};
            /**
             * 调用 setUserInfo 后,全局的getUserInfo都会得到响应,
             */
            userInfo.setUserInfo(user)
        },1000)

    },

    globalData: {},

})
import Event from 'sx-event'

import debounce from './debounce'
import throttle from './throttle'

const GLBEvent = new Event();
const common = {
   //事件
   GLBEvent,
   on,
   off,
   emit,
   //交互提示
   showLoading,
   hideLoading,
   alert,
   //页面跳转
   goto,
   goBack,
   //函数防抖、节流
   debounce,
   throttle,
   //微信开放能力
   call,
   setClipboard,
   getClipboard,
   saveImgToPhotos,
   saveTmpImg,
   getLocation,
   chooseLocation,
};

export default common;
export {
   common,
   //事件
   GLBEvent,
   on,
   off,
   emit,
   //交互提示
   showLoading,
   hideLoading,
   alert,
   //页面跳转
   goto,
   goBack,
   //函数防抖、节流
   debounce,
   throttle,
   //微信开放能力
   call,
   setClipboard,
   getClipboard,
   saveImgToPhotos,
   saveTmpImg,
   getLocation,
   chooseLocation,
};



/**
 * @method  on - 监听一个全局事件
 *
 * @for Event
 *
 * @param {...} params - 同Event.$on
 */
function on(...params) {
   GLBEvent.$on.apply(this, params);
}

/**
 * @method  off - 取消指定事件的指定监听回调
 *
 * @for Event
 *
 * @param {...} params 同Event.$off
 */
function off(...params) {
   GLBEvent.$off.apply(this, params);
}

/**
 * @method  emit - 触发一个全局事件
 *
 * @for Event
 *
 * @param {...} params 同Event.$emit
 */
function emit(...params) {
   GLBEvent.$emit.apply(this, params);
}


/**
 * @method  showLoading - 展示loading（需手动关闭）
 *
 * @param {Object} config - wx的loading参数
 *
 * @param {String} config.title='' - loading标题
 * @param {Boolean} config.mask=true - 是否显示遮罩层
 *
 * @return {Promise | *}
 */
function showLoading(config = {title: "", mask: true}) {
   return new Promise(resolve => {
      if (typeof config !== 'object')
         config = {}
      wx.showLoading({
         ...config,
         success: resolve
      });
   });
}

/**
 * @method  hideLoading - 关闭loading
 */
function hideLoading() {
   wx.hideLoading();
}


/**
 * @method  alert - 弹窗提示
 *
 * @param {String | Object[]} config[].content | config - 提示信息 | 弹窗参数
 *
 * @param {String} config[].title ='温馨提示' - 弹窗标题
 * @param {String} config[].content = config - 弹窗提示内容
 * @param {String} config[].confirmText - 确认按钮文本
 * @param {String} config[].cancelText  - 取消按钮文本
 *
 * @return {Promise}
 */
function alert(config) {
   let params = {title: '温馨提示'};
   if (typeof config === "string" || typeof config === "number")
      params.content = config;
   else
      Object.assign(params, config)

   params.showCancel = params.showCancel ? true : !!params.cancelText

   return new Promise((resolve, reject) => {
      wx.showModal({
         ...params,
         /**
          * @param {Object} res  -  结果
          * @param {Boolean} res.confirm 用户点击了确认？
          * @param {Boolean} res.cancel 用户点击了取消？
          */
         success: function (res) {
            resolve(res);
         },
         fail(err) {
            reject(err);
         }
      });
   });
}


/**
 * @method saveImgToPhotos - 保存图片至本地相册
 *
 * @param {String} IMG_URL - 要保存的网络图片地址
 *
 * @return {Promise}
 */
function saveImgToPhotos(IMG_URL) {
   return new Promise((resolve, fail) => {
      wx.downloadFile({
         url: IMG_URL,
         success: (res) => {
            wx.saveImageToPhotosAlbum({
               filePath: res.tempFilePath,
               success: (res) => {
                  resolve(res);
                  // alert("保存成功！");
               },
               fail
            });
         },
         fail
      });
   });
}

function saveTmpImg(IMG_URL) {
   return new Promise((resolve, fail) => {
      //下载图片
      wx.downloadFile({
         url: IMG_URL,
         success: (res) => {
            //将下载好的图片转为临时路径
            wx.saveFile({
               tempFilePath: res.tempFilePath,
               success: (res) => {
                  resolve(res.savedFilePath);
               },
               fail
            });
         },
         fail
      });
   });
}

/**
 * @method call - 拨打电话
 *
 * @param {String | Number} phoneNumber - 要拨打的电话号码
 *
 * @return {Promise}
 */
function call(phoneNumber) {
   return new Promise((success, fail) => {
      wx.makePhoneCall({
         phoneNumber,
         success,
         fail
      })
   })
}

/**
 * @method setClipboard - 设置剪贴板内容
 *
 * @param {String} data - 剪贴的内容
 *
 * @return {Promise}
 */
function setClipboard(data) {
   return new Promise((success, fail) => {
      wx.setClipboardData({
         data,
         success,
         fail
      })
   })
}

/**
 * @method getClipboard - 获取剪贴板内容
 *
 * @return {Promise}
 */
function getClipboard() {
   return new Promise((success, fail) => {
      wx.getClipboardData({
         success,
         fail
      })
   })
}


/**
 * @method getLocation - 获取位置信息
 *
 * @return {Promise}
 */
function getLocation() {
   return new Promise((success, fail) => {
      new Promise((resolve, reject) => {
         wx.getSetting({
            success(res) {
               res.authSetting["scope.userLocation"] ? resolve() :
                  wx.authorize({
                     scope: "scope.userLocation",
                     success: resolve,
                     fail: reject
                  });
            },
            fail: reject
         });
      }).then(() => {
         wx.getLocation({
            type: "gcj02",
            success,
            fail
         });
      }, fail)
   });
}

/**
 * @method chooseLocation - 在微信地图上选择一个位置
 *
 * @return {Promise}
 */
function chooseLocation() {
   return new Promise((success, fail) => {
      wx.chooseLocation({success, fail});
   });
}

/**
 * @method goto - 小程序跳转页面
 *
 * @param {String} url - 小程序页面地址
 *
 * @param {Object} param - 跳转传参（引用类型的值会被JSON格式化）
 * @param {String} type='navigateTo' - 跳转类型（默认navigateTo)
 */
function goto(url, param = {}, type = 'navigateTo') {
   if (!url || typeof url !== 'string') return;
   url = parseDataToUrl(url, param);
   wx[type]({url});
}

/**
 * @method goBack - 后退
 *
 * @param {Object} config = {delta:1} - 后退参数
 * @param {Number} config.delta=1 后退的页面数
 */
function goBack(config = {delta: 1}) {
   wx.navigateBack(config);
}


/**
 * 转换参数为get类型
 */
function parseDataToUrl(url, params) {
   return typeof url !== "string" || typeof params !== "object" ?
      console.error('type error!', url, params) :
      `${url}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`
}



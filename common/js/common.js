import Event from './event'
import WWW, { BASE_URL, API_URL, TMP_URL } from "./www";


/**
 * 事件功能
 */
const GLBEvent = new Event();

function on(...params) {
  GLBEvent.$on.apply(this, params);
}

function off(...params) {
  GLBEvent.$off.apply(this, params);
}

function emit(...params) {
  GLBEvent.$emit.apply(this, params);
}

/**
 * 缓存功能
 */
import { getCache, setCache,removeCache } from "./cache";

/**
 * loading
 */
function showLoading() {
  return new Promise(resolve => {
    wx.showLoading({
      title: "",
      mask: true,
      success: resolve
    });
  });
}

function hideLoading() {
  return new Promise(resolve => {
    wx.hideLoading();
    resolve();
  });
}

/**
 * 发起微信支付
 */
import wxPayment from "./wxPayment";

/**
 * 保存图片
 */
function saveImg(IMG_URL) {
  return new Promise((resolve, fail) => {
    toast("请稍后。。。");
    wx.downloadFile({
      url: IMG_URL,
      success: (res) => {
        toast("保存中。。。");
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
 * Toast
 */
function toast(config) {
  return new Promise((resolve, reject) => {
    if (typeof config === "string")
      config = { content: config };
    Toast(config);
    /*
    if (typeof config == "string" || typeof config == "number")
      config = { content: config + "" };
    emit("toast", Object.assign({ callback: resolve }, config));
    * */
  });
}

/**
 * 弹窗
 */
function alert(config, callback = null) {
  if (typeof config == "string" || typeof config == "number")
    config = { content: config + "" };

  config = Object.assign({
    title: '温馨提示',
    showCancel: config.cancelText ? !0 : !1
  }, config);

  return new Promise((resolve, reject) => {
    wx.showModal({
      ...config,
      success: function(res) {
        callback && callback(res);
        resolve(res);
        /*if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }*/
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

/**
 * 用户信息
 */
import { getUserInfo } from "./userInfo";

/**
 * 获取位置信息
 */
function getLocation() {
  return new Promise((success, fail) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.userLocation"]) {
          wx.authorize({
            scope: "scope.userLocation",
            success() {
              getLocation();
            },
            fail
          });
        } else
          getLocation();
      },
      fail
    });
    let getLocation = function() {
      wx.getLocation({
        type: "gcj02",
        success,
        fail
      });
      getLocation = null;
    };

  });
}

/**
 * 地图选点
 */
function chooseLocation() {
  return new Promise((success, fail) => {
    wx.chooseLocation({ success, fail });
  });
}

/**
 * 页面跳转
 */
function goTo(config, p = {}) {
  /*
  * 跳转params参数中不能包含引用类型
  * */
  if (!config) return;
  if (typeof config != "object") {
    config = { url: config };
  }
  let {
    url,
    params = p,
    type = "navigateTo"
  } = config;
  url += "";
  if (url.indexOf("/") != 0)
    url = `/pages/${url}/main`;
  url = parseDataToUrl(url, params);
  wx[type]({ url });
}

function goBack(OBJECT) {
  wx.navigateBack(OBJECT);
}


function call(phoneNumber) {
  return new Promise((success, fail) => {
    console.log(success,fail);
    wx.makePhoneCall({
      phoneNumber,
      success,
      fail
    })
  })
}
function setClipboard(data){
  return new Promise((success,fail)=>{
    wx.setClipboardData({
      data,
      success,
      fail
    })
  })
}
function getClipboard(){
  return new Promise((success,fail)=> {
    wx.getClipboardData({
      success,
      fail
    })
  })
}

/**
 * 发起网络请求(默认使用showLoading、hideLoading,APIURL,若携带用户信息会使用getUserInfo)
 */
function getData(url, params = {}, loading = false) {
  /**
   * @name params.enable_user_id
   */

  params = JSON.parse(JSON.stringify(params));
  let debug = !1;
  debug && console.log("get Data!", { url, params, loading });

  /*展示加载图标*/
  if (params.loading !== undefined) {
    loading = params.loading;
    delete params.loading;
  }

  /*默认携带用户信息*/
  //user_id 为 false时取消默认携带用户信息
  if (params.user_id === false) {
    debug && console.log("user_id === false");
    delete params.user_id;
    return new Promise((resolve, reject) =>
      callBack.call(this, resolve, reject)
    );
  }


  /*已经有user_id*/
  if (params.user_id) {
    debug && console.log("user_id has already");
    return new Promise((resolve, reject) =>
      callBack.call(this, resolve, reject)
    );
  }


  /*默认携带用户信息*/
  return new Promise((resolve, reject) => {
    debug && console.log("do getUserInfo");
    getUserInfo().then(res => {
      let { id, sign } = res;
      let key = params.enable_user_id ? "user_id" : "staff_id";
      if (params.enable_user_id)
        delete params.enable_user_id;
      Object.assign(params, { [key]: id, sign });
      callBack.call(this, resolve, reject);
    });
  });

  function callBack(resolve, reject) {
    debug && console.log("do callBack!");
    if (url.indexOf("http://") == -1)
      url = API_URL + url;
    loading && showLoading();

    debug && console.log("do wx.request!", {
      url, params
    });
    wx.request({
        url: url,
        method: "post",
        header: {
          "content-type": "application/json"
        },
        data: params,
        success: (res) => {
          resolve(res.data);
        },
        fail: err => {
          reject(err);
        },
        complete: () => {
          loading && hideLoading();
        }
      }
    );
  }
}

/**
 * 转换参数为get类型
 */
function parseDataToUrl(url, obj) {
  if (typeof url !== "string" || typeof obj !== "object")
    return url;
  let reurl = url + "?";
  let keys = Object.keys(obj);
  keys.forEach(key => reurl += key + "=" + obj[key]/*encodeURIComponent(obj[key])*/ + "&");
  reurl = reurl.substring(0, reurl.length - 1);
  return reurl;
}



const common = {
  on,
  off,
  emit,
  BASE_URL,
  API_URL,
  TMP_URL,
  GLBEvent,
  getCache,
  setCache,
  removeCache,
  showLoading,
  hideLoading,
  wxPayment,
  saveImg,
  saveTmpImg,
  toast,
  alert,
  getLocation,
  chooseLocation,
  getUserInfo,
  call,
  setClipboard,
  getClipboard,
};
export {
  on,
  off,
  emit,
  call,
  setClipboard,
  getClipboard,
  showLoading,
  hideLoading,
  wxPayment,
  saveImg,
  saveTmpImg,
  toast,
  alert,
  getLocation,
  chooseLocation,
  BASE_URL,
  API_URL,
  TMP_URL,
  GLBEvent,
  getCache,
  setCache,
  removeCache,
  getUserInfo,
};

export default common;

function getCtx(selector) {
  const pages = getCurrentPages();
  const ctx = pages[pages.length - 1];

  const componentCtx = ctx.selectComponent(selector);

  if (!componentCtx) {
    console.error("无法找到对应的组件，请按文档说明使用组件");
    return null;
  }
  return componentCtx;
}

function Toast(options) {
  const { selector = "#toast" } = options;
  const ctx = getCtx(selector);

  ctx.handleShow(options);
}

Toast.hide = function(selector = "#toast") {
  const ctx = getCtx(selector);

  ctx.handleHide();
};

function Message(options) {
  const { selector = "#message" } = options;
  const ctx = getCtx(selector);

  ctx.handleShow(options);
}

/*

module.exports = {
  $Toast: Toast,
  $Message: Message
};*/

import userInfo from "wx-mini-program-user";

let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    valid:false//是否强制登录?  (不登录会重新跳转到登录页)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.valid  = options.valid === 'true' || false;
    console.log(this.valid);
  },

  /**
   * 授权登录
   */
  authorLogin: function(e) {
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    this.valid = false;
    userInfo.setWxUserInfo(e.detail);
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let wxU = userInfo.getWxUserInfo(true)
    if(wxU){
      this.valid = false;
      console.log('已授权登录');
      wx.navigateBack();
    }else if(this.valid){
      setTimeout(()=>{
        App.authLogin(true);
      },600)
    }

  },
});
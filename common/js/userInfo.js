import Event from "./event";
import {getCache, setCache} from './cache'


const event = new Event();

let _userInfo = '',
    _wxUserInfo = null,
    userInfo = {
        code: '',
        init,
        getUserInfo,
        setUserInfo,
        setWxUserInfo,
        getWxUserInfo
    };

export default userInfo;

export {getUserInfo, init, setUserInfo}

/**
 * 初始化 promise 函数
 * then参数([wx.login登录结果, 用户授权?授权用户数据:空])
 */
function init() {
    return Promise.all([
        doWxLogin(),
        new Promise((resolve, fail) => {
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: res => {
                                console.log('已授权',res);
                                userInfo.setWxUserInfo(res);
                                resolve(res);
                            },
                            fail
                        })
                    } else
                        resolve()
                },
                fail
            });
        })
    ])
}

function doWxLogin() {
    return new Promise((resolve, fail) => {
        // 登录
        wx.login({
            success(res) {
                userInfo.code = res.code;
                resolve(res)
            }, fail
        })
    })
}


/**
 * 用户数据操作
 */
function getUserInfo(sync = false) {
    if (sync)
        return _userInfo
    else
        return new Promise((resolve, reject) => {
            if (_userInfo) {
                resolve(_userInfo);
                return;
            }
            let callback = userInfo => {
                event.$off('userInfoInit', callback)
                callback = null;
                resolve(userInfo);
            }
            event.$on('userInfoInit', callback);
        })
}

function setUserInfo(userInfo) {
    _userInfo = _userInfo ? Object.assign(_userInfo, userInfo) : userInfo
    event.$emit('userInfoInit', userInfo)
}


/**
 * 微信授权用户数据操作
 */
function setWxUserInfo(data) {
    _wxUserInfo = _wxUserInfo ? Object.assign(_wxUserInfo, data) : data
    event.$emit('wxUserInfoInit', data)
    // let {mp: {detail}} = data;
    let {userInfo} = data;
    if (userInfo && typeof userInfo === 'string') {
        userInfo = JSON.parse(userInfo)
    }
    // setUserInfo(userInfo);
}

function getWxUserInfo(sync = false) {
    if (sync)
        return _wxUserInfo
    else
        return new Promise((resolve, reject) => {
            if (_wxUserInfo)
                resolve(_wxUserInfo)
            else {
                let callback = wxUserInfo => {
                    event.$off('wxUserInfoInit', callback)
                    callback = null;
                    resolve(wxUserInfo);
                }
                event.$on('wxUserInfoInit', callback);
            }
        })
}

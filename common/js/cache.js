function _setCache(key, data, cache_time = 0) {
  return new Promise((resolve, reject) => {
    if (data === undefined)
      reject({msg: `setCache '${key}' err! data is undefined`});
    let now = new Date();
    wx.setStorage({
      key,
      data: {
        time: cache_time === 0 ? 0 : +now + cache_time,
        data
      },
      success: resolve,
      fail: reject,
    });
  })
}

function _getCache(key) {
  return new Promise((resolve, reject) =>
    wx.getStorage({
      key,
      success({data: res}) {
        let now = new Date();
        if (res.time === 0)
          resolve(res.data);
        else if (res && res.time - now > 0)
          resolve(res.data);
        else {
          wx.removeStorage({key});
          resolve(null);
        }
      },
      fail(err) {
        resolve(null)
      }
    }))
}

function _removeCache(key) {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key,
      success: resolve
    })
  })
}

export default {
  setCache: _setCache,
  getCache: _getCache,
  removeCache: _removeCache
}

export var setCache = _setCache;
export var getCache = _getCache;
export var removeCache = _removeCache;
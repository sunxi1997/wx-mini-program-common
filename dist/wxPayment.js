export default function wxPayment(payData) {
  return new Promise((resolve, reject) => {
    console.log(payData,typeof payData !== 'object',typeof payData);
    if (typeof payData !== 'object'){
      reject({msg:'params err!',err:0});
      return;
    }
    let {
      timeStamp,
      nonceStr,
      paySign,
      package: _package,
      signType = 'MD5',
    } = payData;

    wx.requestPayment({
      timeStamp,
      nonceStr,
      paySign,
      signType,
      package: _package,
      success:resolve,
      fail:reject
    });

    function success() {

    }
    function fail() {

    }
  })
}

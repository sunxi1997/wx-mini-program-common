/**
 * 函数节流
 *
 *
 * 执行一次函数后,一段时间内再重复调用将不再执行
 */
function throttle(func, wait, _this) {
   let valid = true;

   return function () {
      if (valid) {
         func.apply(_this || this, arguments);
         valid = false;
         setTimeout(() => valid = true, wait)
      }
   };
}

export default throttle;
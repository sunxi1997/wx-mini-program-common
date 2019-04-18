import throttle from "./throttle";

/**
 * 函数防抖
 *
 * 一段时间内函数被多次调用,只最后一次才真正执行
 */
function debounce(func, wait, _this) {
   let timer;

   return function () {
      clearTimeout(timer);
      timer = setTimeout(func.bind(_this || this, ...arguments), wait);
   };
}

export default debounce;
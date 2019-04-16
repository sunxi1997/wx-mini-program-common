
class Event {
   constructor(){

      let funcs = {};

      Object.assign(this,{$on,$off,$emit});

      function $on(eventName,func) {
         if(funcs[eventName])
            funcs[eventName].push(func);
         else
            funcs[eventName] = [func];
      }

      function $off(eventName,func) {
         if (funcs[eventName]) {
            let index = funcs[eventName].indexOf(func);
            index != -1 && (funcs[eventName][index]=null);
         }
      }

      function $emit(eventName,...params) {
         if(funcs[eventName])
            funcs[eventName].forEach(func=>func&&func(...params));
      }
   }

}

export default Event;
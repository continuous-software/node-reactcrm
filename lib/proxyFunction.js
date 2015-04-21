function proxyFunction (target, handler) {

  var proxy = Object.create(Object.getPrototypeOf(target));

  Object.keys(target).forEach(function (key) {
    if (typeof target[key] === 'function') {
      proxy[key] = function () {
        var args = [].slice.call(arguments);
        if (handler.get) {
          return handler.get(target, key).apply(target, args);
        } else {
          return target[key].apply(target, args);
        }
      }
    }
  });

  return proxy;
}

module.exports = proxyFunction;

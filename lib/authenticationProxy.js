function authenticationProxy (token) {
  var proxy = {};

  proxy.get = function get (target, key) {
    return function () {
      var args = [].slice.call(arguments);
      args.push({
        auth: {
          bearer: token
        }
      });

      return target[key].apply(target, args);
    }
  };

  return proxy;
}

module.exports = authenticationProxy;
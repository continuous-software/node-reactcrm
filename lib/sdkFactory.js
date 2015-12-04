var got = require('got');
var url = require('url');

module.exports = function (linksSpecifications, options) {
  const optionsOrDefault = Object.assign({}, options || {}, {protocol: 'http'});
  const prototype = {};
  const paramsReg = /{[^}]+}/i; // find fragment url "/foo/:id"

  linksSpecifications.forEach(link => {
    try {
      const rel = link.rel;
      const method = link.method.toLowerCase();
      const templatePath = link.href;
      const hasBody = function hasBody (method) {
        var lowerCasedMethod = method.toLowerCase();
        return lowerCasedMethod === 'put' || lowerCasedMethod === 'post';
      };
      prototype[rel] = function () {
        const arg = [].slice.call(arguments);
        const match = paramsReg.exec(templatePath);
        const actualPath = !!match === false ? templatePath :
          match.reduce((previous, current) => previous.replace(paramsReg, arg.shift()), templatePath);
        const urlObject = Object.assign({}, optionsOrDefault, {pathname: actualPath});
        const params = hasBody(method) === false ? {query: arg[0]} : {body: JSON.stringify(arg[0])};
        var opt = {
          json: true,
          headers: {
            'Content-Type': 'application/json',
            'user-agent': 'funnels-sdk-factory'
          }
        };
        if (this.token) {
          opt.headers['Authorization'] = 'Bearer ' + this.token
        }
        var href = url.format(urlObject)
        return got[method](href, Object.assign({}, opt, params))
          .then(result => {
            return result.body
          })
          .catch(err => {
            return Promise.reject(Object.assign({}, err.response.body || {}, {httpStatusCode: err.response.statusCode}))
          });
      }
    } catch (e) {
      console.log('could not add the action ' + link.description);
    }
  });

  return function sdkFactory (token) {
    return Object.create(prototype, {
      token: {
        value: token,
        writable: true
      }
    })
  }
};

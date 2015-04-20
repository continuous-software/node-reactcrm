var P = require('bluebird');
var request = require('request');
var jsonPointer = require('skeemas-json-pointer');
var assign = require('object-assign');


function createNamespace (schema) {
  return function (definition) {
    var namespace = Object.create({
      get: P.promisify(request.get),
      put: P.promisify(request.put),
      post: P.promisify(request.post),
      delete: P.promisify(request.del)
    });
    var root = schema.links.filter(function (link) {
      return link.rel === 'self';
    });
    var links = definition.links || [];

    links.forEach(function (link) {

      var rel = camelize(link.rel);
      var href = root[0].href + link.href;
      var method = link.method.toLowerCase();

      namespace[rel] = function action () {

        var i;
        var args = [].slice.call(arguments);
        var pathParams = href.match(/{[^}]+}/g) || [];
        var requetsParams = {
          json: true
        };
        pathParams = pathParams.map(function (path) {
          return decodeURIComponent(path);
        });
        for (i = 0; i < pathParams.length; i++) {
          href = href.replace(/{[^}]+}/, args.shift());
        }


        requetsParams.uri = href;
        assign(requetsParams,{json:args.shift() || {}});

        return namespace[method](requetsParams)
          .spread(function (res, body) {
            return body;
          });
      }
    });

    return links.length ? namespace : null;

    function camelize (string) {
      var parts = string.split(' ');

      return parts.map(function (part, index) {

        part = part.toLowerCase();

        if (index > 0) {
          part = part[0].toUpperCase() + part.substr(1);
        }
        return part;
      }).join('');
    }
  }
}

function buildResource (schema) {
  var api = {};
  Object.keys(schema.properties).forEach((function (defKey) {
    var subSchema = schema.properties[defKey].$ref ? jsonPointer(schema.properties[defKey].$ref).get(schema) : schema.properties[defKey];
    var namespace = createNamespace(schema)(subSchema);
    if (namespace !== null) {
      api[defKey] = namespace;
    }
  }));

  return api;
}


module.exports = buildResource;

'use strict';

var ReactCRM = require('./lib/ReactCRM.js');
var request = require('request');
var P = require('bluebird');

module.exports = {
  getAuthenticatedApplication: function (apiKey, apiSecret, options) {


    var httpGet = P.promisify(request.get);
    var schemaUrls = process.env.NODE_ENV === 'production' ? 'https://api.reactcrm.com/public/schema.json' : 'http://127.0.0.1:8001/public/schema.json';

    return (options.schema ? P.resolve(new ReactCRM(apiKey, apiSecret, options)) :
      httpGet(schemaUrls,{json:true})
        .spread(function (res, schema) {
          options.schema = schema;
          return new ReactCRM(apiKey, apiSecret, options);
        }))
      .then(function (service) {
        return service.authenticate();
      })
  },
  ReactCRM: ReactCRM
};

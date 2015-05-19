'use strict';

var ReactCRM = require('./lib/ReactCRM.js');
var request = require('request');
var P = require('bluebird');

module.exports = {
  getAuthenticatedApplication: function (apiKey, apiSecret, options) {


    var httpGet = P.promisify(request.get);
    var schemaUrls = process.env.NODE_ENV === 'production' ? 'https://api.reactcrm.com/schema.json' : 'http://localhost:8001/schema.json';

    return (options.schema ? P.resolve(new ReactCRM(apiKey, apiSecret, options)) :
      httpGet(schemaUrls)
        .then(function (schema) {
          options.schema = schema;
          return new ReactCRM(apiKey, apiSecret, options);
        }))
      .then(function (service) {
        return service.authenticate();
      })
  },
  ReactCRM: ReactCRM
};

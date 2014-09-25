var extend = require('util')._extend;
var assert = require('assert');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));


function ReactCRM(apiKey, apiSecret, options) {
    assert(apiKey, 'apiKey is required');
    assert(apiKey, 'apiSecret is required');

    //can be overwritten in options
    this.http = request;
    this.endpoint = 'http://api.reactcrm.com';
    this.ACTION_AUTHENTICATE = '/authenticateApplication';
    this.ACTION_GET_APPLICATION = '/getApplication';
    this.ACTION_GET_STOREFRONT = '/getCampaign';
    this.ACTION_UPDATE_STOREFRONT = '/updateCampaign';
    this.ACTION_GET_ORDER = '/getOrder';
    this.ACTION_ADD_PROSPECT = '/addProspect';
    this.ACTION_ADD_ORDER = '/addOrder';

    extend(this, options);

    //can not be overwritten in options
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
}

ReactCRM.prototype.httpGET = function httpGET(actionName, params) {
    var token = this.token;
    var options = {
        method: 'GET',
        url: this.endpoint + this[actionName],
        qs: params || {}
    };

    if (token) {
        options.auth = {
            bearer: token
        }
    }

    return request(options).spread(function (res, body) {
        if (res.statusCode >= 400) {
            throw new Error('http request was not successful');
        }

        return body;
    });
};

ReactCRM.prototype.httpPOST = function httpPOST(actionName, body) {
    var token = this.token;
    var options = {
        method: 'POST',
        url: this.endpoint + this[actionName],
        json: body
    };

    if (token) {
        options.auth = {
            bearer: token
        }
    }

    return request(options).spread(function (res, body) {

        if (res.statusCode >= 400) {
            //todo maybe create specific error
            throw new Error('http request was not successful');
        }

        return body;
    });
};


ReactCRM.prototype.authenticate = function () {
    var service = this;
    return !service.token ? service.httpPOST('ACTION_AUTHENTICATE', {apiKey: service.apiKey, apiSecret: service.apiSecret}).then(function (result) {
        service.token = result.token;
        return service;
    }) : Promise.resolve(service);
};

ReactCRM.prototype.getStoreFront = function getStoreFront(token) {

    return this.authenticate()
        .then(function (service) {
            return service.httpGET('ACTION_GET_STOREFRONT');
        });
};

ReactCRM.prototype.saveProspect = function saveProspect(prospect) {
    return this.authenticate()
        .then(function (service) {
            return service.httpPOST('ACTION_ADD_PROSPECT', prospect);
        });
};

ReactCRM.prototype.processOrder = function processOrder() {

};

module.exports = ReactCRM;





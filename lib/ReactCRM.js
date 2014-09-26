var extend = require('util')._extend;
var assert = require('assert');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var HttpError = require('./errors.js').HttpError;
var cent42 = require('42-cent');


function ReactCRM(apiKey, apiSecret, options) {
    assert(apiKey, 'apiKey is required');
    assert(apiKey, 'apiSecret is required');

    //can be overwritten in options
    this.http = request;
    this.cent42 = cent42;
    this.endpoint = 'http://api.reactcrm.com';

    extend(this, options);

    //can not be overwritten in options
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
}

ReactCRM.prototype.httpGET = function httpGET(path, params) {
    var token = this.token;
    var options = {
        method: 'GET',
        url: this.endpoint + path,
        qs: params || {},
        json:{}
    };

    if (token) {
        options.auth = {
            bearer: token
        }
    }

    return request(options).spread(function (res, body) {
        if (res.statusCode >= 400) {
            throw new HttpError(res.statusCode, body.error || body.message || 'HTTP error, the request was not successful');
        }

        return body;
    });
};

ReactCRM.prototype.httpPOST = function httpPOST(url, body) {
    var token = this.token;
    var options = {
        method: 'POST',
        url: this.endpoint + url,
        json: body
    };

    if (token) {
        options.auth = {
            bearer: token
        }
    }

    return request(options).spread(function (res, body) {

        if (res.statusCode >= 400) {
            throw new HttpError(res.statusCode, body.error || body.message || 'HTTP error, the request was not successful');
        }

        return body;
    });
};

ReactCRM.prototype.authenticate = function () {
    var service = this;
    return !service.token ? service.httpPOST('/authenticateApplication', {apiKey: service.apiKey, apiSecret: service.apiSecret}).then(function (result) {
        service.token = result.token;
        service.campaign = result.campaign;
        return service;
    }) : Promise.resolve(service);
};

ReactCRM.prototype.getStoreFront = function getStoreFront(reload) {

    var service;

    return this.authenticate()
        .then(function (serv) {
            service = serv;
            return reload === true ? service.httpGET('/campaigns/' + service.campaign.id) : service.campaign;
        })
        .then(function (campaign) {
            service.campaign = campaign;
            return campaign;
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

ReactCRM.prototype.getOrder = function getOrder(id) {
    return this.authenticate().then(function (service) {
        return service.httpGET('ACTION_GET_ORDER');
    });
};

ReactCRM.prototype.updateStoreFront = function updateStoreFront() {

};

ReactCRM.prototype.addOrder = function addOrder() {

};

module.exports = ReactCRM;





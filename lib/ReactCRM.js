var extend = require('util')._extend;
var assert = require('assert');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var HttpError = require('./errors.js').HttpError;
var cent42 = require('42-cent');
var oxr = require('open-exchange-rates');
var fx = require('money');


var prospectSchema = {};

function mapKeys(src, schema, target) {
    var out = target || {};
    Object.getOwnPropertyNames(src).forEach(function (key) {
        if (schema[key]) {
            out[schema[key]] = src[key];
        }
    });
    return out;
}

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
        json: {}
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

    var service = this;

    return this.getStoreFront()
        .then(function (campaign) {
            prospect.campaignId = campaign.id;
            return service.httpPOST('/prospects', prospect);
        });
};

ReactCRM.prototype.processOrder = function processOrder(processor, offer, order, cc, prospect, other) {
    var service = this;
    var reactOrder = {
        gateway_id: processor.id,
        prospect_id: prospect.id,
        offer_id: offer.id,
        original_amount: offer.amount,
        converted_amount: '',
        ip_address: prospect.source.ip_address,
        referer: prospect.source.referer,
        creditcard: JSON.stringify(cc)
    };
    var gateway = this.cent42.use(processor.type, processor.credentials);
    var latest;

    oxr.set({ app_id: '9feac8f89fcd492086f8644de9da1974' });
    latest = Promise.promisify(oxr.latest);

    return latest.then(function () {
        if (offer.currency !== 'USD') {
            fx.rates = oxr.rates;
            fx.base = oxr.base;
            reactOrder.converted_amount = (fx(reactOrder.original_amount).from(offer.currency).to('USD')).toFixed(2);
            reactOrder.converted_amount = (reactOrder.converted_amount - (reactOrder.converted_amount / 100)).toFixed(2);
        }
        else {
            reactOrder.converted_amount = reactOrder.original_amount;
        }

        return gateway.submitTransaction({amount: reactOrder.converted_amount}, cc, mapKeys(prospect, prospectSchema), other).then(function (result) {
            reactOrder.transaction_id = result.transactionId;
            reactOrder.billing_status = 'completed';
        }).catch(function (error) {
            reactOrder.gateway_response = error.message || 'error while processing the response';
            reactOrder.billing_status = 'failed';
        }).finally(function () {
            return service.addOrder(reactOrder);
        });
    });
};

ReactCRM.prototype.getOrder = function getOrder(id) {
    return this.authenticate().then(function (service) {
        return service.httpGET('/orders/' + id);
    });
};

ReactCRM.prototype.updateStoreFront = function updateStoreFront() {

};

ReactCRM.prototype.addOrder = function addOrder(order) {
    return this.authenticate().then(function (service) {
        return service.httpPOST('/orders', order);
    });
};

module.exports = ReactCRM;





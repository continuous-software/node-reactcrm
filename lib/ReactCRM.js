var creditcard = require('creditcard');
var extend = require('util')._extend;
var assert = require('assert');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var HttpError = require('./errors.js').HttpError;
var cent42 = require('42-cent');
var oxr = require('open-exchange-rates');
var fx = require('money');

//todo set this in external module, called from 42-cent, and storefront too
function mapKeys(source, schema, target) {
    var output = target || {};

    Object.getOwnPropertyNames(source).forEach(function (key) {
        if (schema[key]) {
            output[schema[key]] = source[key];
        }
    });
    return output;
}

var prospectSchema = {
    firstname: 'customerFirstName',
    lastname: 'customerLastName',
    email: 'customerEmail'
};

var billingSchema = {
    address: 'billingAddress',
    city: 'billingCity',
    zipcode: 'billingZip',
    country: 'billingCountry',
    region: 'billingState'
};


function ReactCRM(apiKey, apiSecret, options) {
    assert(apiKey, 'apiKey is required');
    assert(apiKey, 'apiSecret is required');

    //can be overwritten in options
    this.cent42 = cent42;
    this.endpoint = 'https://api.reactcrm.com';

    extend(this, options);

    //can not be overwritten in options
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
}

function httpBody(method, url, body) {
    var token = this.token;
    var options = {
        method: method,
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
    return httpBody.call(this, 'POST', url, body);
};

ReactCRM.prototype.httpPUT = function httpPUT(url, body) {
    return httpBody.call(this, 'PUT', url, body);
};

ReactCRM.prototype.authenticate = function () {
    var service = this;
    return !service.token ? service.httpPOST('/authenticateApplication', {
        apiKey: service.apiKey,
        apiSecret: service.apiSecret
    }).then(function (result) {
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

ReactCRM.prototype.processOrder = function processOrder(processor, offer, creditCard, prospect, other) {
    //todo these again make a lot of assumptions on object properties
    var service = this;
    var reactOrder = {
        gateway_id: processor.id,
        prospect_id: prospect.id,
        offer_id: offer.id,
        original_amount: offer.amount,
        converted_amount: '',
        ip_address: prospect.source.ip_address,
        referer: prospect.source.referer,
        creditcard: creditCard
    };

    reactOrder.creditcard.number = creditcard.truncate();
    var creditCard42 = {
        creditCardNumber: creditCard.number.replace(/\s/g, ''),
        expirationMonth: creditCard.expiration.split('/')[0].trim(),
        expirationYear: '20' + creditCard.expiration.split('/')[1].trim(),
        cvv: creditCard.cvv,
        cardholder: creditCard.name
    };
    var prospect42 = {};
    if (prospect) {
        prospect42 = mapKeys(prospect, prospectSchema);
        if (prospect.billing) {
            prospect42 = mapKeys(prospect.billing, billingSchema, prospect42);
        }
        if (prospect.shipping) {
            prospect42 = mapKeys(prospect.shipping, billingSchema, prospect42);
        }
    }
    var gateway = this.cent42.use(processor.type, processor.credentials);
    var latest;

    oxr.set({app_id: '9feac8f89fcd492086f8644de9da1974'});
    latest = Promise.promisify(oxr.latest);

    return latest().then(function () {
        if (offer.currency && offer.currency !== 'USD') {
            fx.rates = oxr.rates;
            fx.base = oxr.base;
            reactOrder.converted_amount = (fx(reactOrder.original_amount).from(offer.currency).to('USD')).toFixed(2);
            reactOrder.converted_amount = (reactOrder.converted_amount - (reactOrder.converted_amount / 100)).toFixed(2);
        }
        else {
            reactOrder.converted_amount = reactOrder.original_amount;
        }

        return gateway.submitTransaction({amount: reactOrder.converted_amount}, creditCard42, prospect42, other)
            .then(function (result) {
                reactOrder.transaction_id = result.transactionId;
                reactOrder.billing_status = 'completed';
                return service.addOrder(reactOrder);
            })
            .catch(function (error) {
                reactOrder.gateway_response = error.message || 'error while processing the response';
                reactOrder.billing_status = 'failed';
                return service.addOrder(reactOrder);
            });
        //finally statement does not return the value of the addOrder promise ?
    });
};

ReactCRM.prototype.getOrder = function getOrder(id) {
    return this.authenticate().then(function (service) {
        return service.httpGET('/orders/' + id);
    });
};

ReactCRM.prototype.incrementVisits = function updateStoreFront(n) {
    var number = n || 1;
    var service = this;
    return this.getStoreFront().then(function (campaign) {
        return service.httpPUT('/campaigns/' + campaign.id, {visits: number}).then(function (campaign) {
            service.campaign = campaign;
            return campaign;
        });
    });
};

ReactCRM.prototype.addOrder = function addOrder(order) {
    var service = this;
    return this.getStoreFront().then(function (campaign) {
        if (!order.campaign_id) {
            order.campaign_id = campaign.id;
        }
        return service.httpPOST('/orders', order);
    });
};

module.exports = ReactCRM;

var creditcard = require('creditcard');
var extend = require('util')._extend;
var assert = require('assert');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var HttpError = require('./errors.js').HttpError;
var cent42 = require('42-cent');
var oxr = require('open-exchange-rates-promise');
var fx = require('money');
var store = require('./memoryStore.js');

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

  //todo api key should be passed as an option
  this.oxr = oxr.cache({store: store()}, oxr.factory({appId: '9feac8f89fcd492086f8644de9da1974'}));
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

ReactCRM.prototype.processOrder = function processOrder(processor, offer, creditCard, prospect, trackers, other) {
  var service = this;

  //todo quite few assumption on object properties
  var reactOrder = {
    gateway_id: processor.id,
    prospect_id: prospect.id,
    offer_id: offer.id,
    original_amount: offer.amount,
    converted_amount: '',
    ip_address: prospect.source.ip_address,
    referer: prospect.source.referer,
    creditcard: creditCard,
    upsells: offer.upsells
  };

  var creditCard42 = cent42.createCreditCard()
    .withExpirationMonth(creditCard.expiration.split('/')[0].trim())
    .withExpirationYear('20' + creditCard.expiration.split('/')[1].trim())
    .withCvv(creditCard.cvv)
    .withCreditCardNumber(creditCard.number.replace(/\s/g, ''));

  var billing = prospect.billing || {};
  var shipping = prospect.shipping || {};

  var prospect42 = cent42.createProspect()
    .withCustomerFirstName(prospect.firstname)
    .withCustomerLastName(prospect.lastname)
    .withCustomerEmail(prospect.email)
    .withCustomerPhone(prospect.phone)
    .withBillingAddress(billing.address)
    .withBillingCity(billing.city)
    .withBillingCountry(billing.country)
    .withBillingState(billing.state)
    .withBillingZip(billing.zipcode)
    .withShippingFirstName(shipping.firstname)
    .withShippingLastName(shipping.lastname)
    .withShippingAddress(shipping.address)
    .withShippingCity(shipping.city)
    .withShippingCountry(shipping.country)
    .withShippingState(shipping.state)
    .withShippingZip(shipping.zipcode);

  var gateway = service.cent42.use(processor.type, processor);

  return ((offer.currency && offer.currency !== 'USD') ? this.oxr.latest() : Promise.resolve())
    .then(function (results) {
      if (offer.currency && offer.currency !== 'USD') {
        fx.rates = results.rates;
        fx.base = results.base;
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
          reactOrder.creditcard.number = creditcard.truncate(reactOrder.creditcard.number);
          reactOrder.channels = trackers;
          return service.addOrder(reactOrder);
        })
        .catch(function (error) {
          reactOrder.gateway_response = error.message || 'error while processing the response';
          reactOrder.billing_status = 'failed';
          reactOrder.creditcard.number = creditcard.truncate(reactOrder.creditcard.number);
          reactOrder.channels = trackers;
          return service.addOrder(reactOrder);
        });
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
      service.campaign.visits = campaign.visits;
      return service.campaign;
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

ReactCRM.prototype.processSubscription = function processSubscription(processor, offer, creditCard, prospect, trackers, other) {
  var service = this;
  var gateway;
  var creditCard42;
  var prospect42;
  var reactOrder;


  var billing = prospect.billing || {};
  var shipping = prospect.shipping || {};
  //todo even pass merchantCustomerId as a standard parameter across the gateways
  var options = {
    merchantCustomerId: prospect.id,//authorize
    merchantCustomerID: prospect.id,//rocketGate
    description: 'From campaign ' + service.campaign.id + ' at ' + new Date()
  };

  creditCard42 = cent42.createCreditCard()
    .withExpirationMonth(creditCard.expiration.split('/')[0].trim())
    .withExpirationYear('20' + creditCard.expiration.split('/')[1].trim())
    .withCvv(creditCard.cvv)
    .withCreditCardNumber(creditCard.number.replace(/\s/g, ''));

  prospect42 = cent42.createProspect({id: prospect.id})
    .withCustomerFirstName(prospect.firstname)
    .withCustomerLastName(prospect.lastname)
    .withCustomerEmail(prospect.email)
    .withCustomerPhone(prospect.phone)
    .withBillingAddress(billing.address)
    .withBillingCity(billing.city)
    .withBillingCountry(billing.country)
    .withBillingState(billing.state)
    .withBillingZip(billing.zipcode)
    .withShippingFirstName(shipping.firstname)
    .withShippingLastName(shipping.lastname)
    .withShippingAddress(shipping.address)
    .withShippingCity(shipping.city)
    .withShippingCountry(shipping.country)
    .withShippingState(shipping.state)
    .withShippingZip(shipping.zipcode);

  //vault
  gateway = service.cent42.use(processor.type, processor);
  return gateway.createCustomerProfile(creditCard42, prospect42, prospect42, options)
    .then(function (customer) {
      //initial transaction with token
      prospect42.withProfileId(customer.profileId);
      creditCard.token = customer.profileId;

      reactOrder = {
        gateway_id: processor.id,
        prospect_id: prospect.id,
        offer_id: offer.id,
        original_amount: offer.recurringPlan.amount,
        converted_amount: offer.recurringPlan.amount,
        ip_address: prospect.source.ip_address,
        referer: prospect.source.referer,
        creditcard: creditCard,
        upsells: offer.upsells
      };
      reactOrder.creditcard.number = creditcard.truncate(reactOrder.creditcard.number);
      return gateway.chargeCustomer({amount: offer.recurringPlan.amount}, prospect42)
        .then(function success(res) {
          reactOrder.billing_status = 'completed';
          reactOrder.transaction_id = res.transactionId;
        }, function error(err) {
          reactOrder.billing_status = 'failed';
          reactOrder.gateway_response = err.message || 'unidentified error in the gateway';
        });
    })
    .then(function () {
      return service.addOrder(reactOrder);
    })
    .then(function (ord) {
      reactOrder = ord;
      return service.httpPOST('/subscriptions', {refTransactionId: ord.id});
    }).then(function () {
      return reactOrder;
    }).catch(function (err) {
      reactOrder = {
        gateway_id: processor.id,
        prospect_id: prospect.id,
        offer_id: offer.id,
        original_amount: offer.recurringPlan.amount,
        converted_amount: offer.recurringPlan.amount,
        ip_address: prospect.source.ip_address,
        referer: prospect.source.referer,
        creditcard: creditCard,
        upsells: offer.upsells,
        billing_status: 'failed',
        gateway_response: err.message || 'unidentified error in the gateway'
      };
      reactOrder.creditcard.number = creditcard.truncate(reactOrder.creditcard.number);
      return service.addOrder(reactOrder);
    });
};

module.exports = ReactCRM;

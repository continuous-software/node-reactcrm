var assert = require('assert');
var assign = require('object-assign');
var resourceBuilder = require('./resourceBuilder.js');
var schema = require('./schema.js');
var proxy = require('./proxyFunction.js');
var authenticationProxy = require('./authenticationProxy.js');
var P = require('bluebird');
var cent42 = require('42-cent');
var oxr = require('oxr');
var store = require('./memoryStore.js');
var fx = require('money');
var creditcard = require('creditcard');


function ReactCRM (apiKey, apiSecret, options) {
  assert(apiKey, 'apiKey is required');
  assert(apiSecret, 'apiSecret is required');

  this.oxr = oxr.cache({
    store: store()
  }, oxr.factory({
    appId: options.oxrAppId || process.env.OXR_APP_ID
  }));
  this.cent42 = cent42;

  options = options || {};
  options.endpoint = options.endpoint || 'https://api.reactcrm.com';
  assign(this, options);

  this.api = resourceBuilder(options.schema || schema);
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
}

ReactCRM.prototype.authenticate = function authenticate () {
  var service = this;
  return service.api.applications.authenticate({apiKey: service.apiKey, apiSecret: service.apiSecret})
    .then(function (result) {
      service.campaignId = result.campaignId;
      Object.keys(service.api).forEach(function (namespace) {
        service.api[namespace] = proxy(service.api[namespace], authenticationProxy(result.token));
      });
      return service.getStoreFront(true);
    }).then(function (campaign) {
      service.campaign = campaign;
      return service;
    });
};

ReactCRM.prototype.getStoreFront = function (reload) {
  var service = this;
  var id = service.campaignId;
  return (reload === true ? P.all([
    service.api.campaigns.self(id),
    service.api.campaigns.offers(id),
    service.api.campaigns.trackers(id),
    service.api.campaigns.banks(id),
    service.api.campaigns.shippingOffers(id),
    service.api.campaigns.upsales(id)
  ])
    .then(function (result) {
      var campaign = result[0];
      campaign.offers = result[1];
      campaign.trackers = result[2];
      campaign.banks = result[3];
      campaign.shippingOffers = result[4];
      campaign.upsells = result[5];
      return campaign;
    }) :
    P.resolve(service.campaign))
    .tap(function (campaign) {
      campaign.status = (campaign.offers && campaign.offers.length)
      && (campaign.shippingOffers && campaign.shippingOffers.length)
      && (campaign.banks && campaign.banks.length)
      ? 'ready' : 'incomplete'
      service.campaign = campaign;
    });
};

ReactCRM.prototype.saveProspect = function saveProspect (prospect) {
  var service = this;

  // ensure backward compatibility with old addrss modelling
  function isSameAddress (billing, shipping) {
    return ['address', 'city', 'zipcode', 'country', 'region'].every(function (prop) {
      return billing[prop] === shipping[prop];
    })
  }

  prospect.addresses = isSameAddress(prospect.billing, prospect.shipping) ?
    [prospect.billing] : [prospect.billing, prospect.shipping];


  return this.getStoreFront()
    .then(function (campaign) {
      prospect.campaignId = campaign.id;
      return service.api.prospects.create(prospect);
    });
};

ReactCRM.prototype.processOrder = function processOrder (processor, offer, creditCard, prospect, trackers, other) {
  var service = this;

  var reactOrder = {
    gateway_id: processor.id,
    prospect_id: prospect.id,
    offer_id: offer.id,
    shippingOfferId: offer.shippingOfferId,
    original_amount: offer.amount,
    converted_amount: '',
    ipAddress: {ip: prospect.source.ip},
    referer: prospect.source.referer,
    creditcard: creditCard,
    upsells: offer.upsells,
    shippingAddressId: prospect.shipping.id,
    billingAddressId: prospect.billing.id
  };
  var creditCard42 = cent42.createCreditCard()
    .withExpirationMonth(creditCard.expiration.split('/')[0].trim())
    .withExpirationYear('20' + creditCard.expiration.split('/')[1].trim())
    .withCvv2(creditCard.cvv)
    .withCreditCardNumber(creditCard.number.replace(/\s/g, ''));

  var billing = prospect.billing || {};
  var shipping = prospect.shipping || {};

  var prospect42 = cent42.createProspect()
    .withBillingFirstName(prospect.firstname)
    .withBillingLastName(prospect.lastname)
    .withBillingEmailAddress(prospect.email)
    .withBillingPhone(prospect.phone)
    .withBillingAddress1(billing.address)
    .withBillingCity(billing.city)
    .withBillingCountry(billing.country)
    .withBillingState(billing.region)
    .withBillingPostalCode(billing.zipcode)
    .withShippingFirstName(shipping.firstname)
    .withShippingLastName(shipping.lastname)
    .withShippingAddress1(shipping.address)
    .withShippingCity(shipping.city)
    .withShippingCountry(shipping.country)
    .withShippingState(shipping.region)
    .withShippingPostalCode(shipping.zipcode);

  var gateway;

  return this.oxr.latest()
    .then(function (results) {
      if (offer.currency != 'USD') {
        if (!results) {
          throw new Error('Unable to retrieve conversion rates to process in USD');
        }
        fx.rates = results.rates;
        fx.base = results.base;
        reactOrder.converted_amount = (fx(reactOrder.original_amount).from(offer.currency).to('USD')).toFixed(2);
        reactOrder.converted_amount = (reactOrder.converted_amount - (reactOrder.converted_amount / 100)).toFixed(2);
      } else {
        reactOrder.converted_amount = reactOrder.original_amount;
      }
      if (!processor.configuration) {
        throw new Error('No credentials provided for the configured gateway');
      }
      gateway = service.cent42.use(processor.cent42, processor.configuration);
      return gateway.submitTransaction({amount: reactOrder.converted_amount}, creditCard42, prospect42, other)
        .then(function (result) {
          result.message = 'Success';
          reactOrder.gateway_response = result;
          reactOrder.transaction_id = result.transactionId;
          reactOrder.billing_status = 'completed';
        })
        .catch(function (err) {
          reactOrder.gateway_response = err;
          reactOrder.billing_status = 'failed';
        });
    })
    .then(function () {
      reactOrder.creditcard.number = creditcard.truncate(reactOrder.creditcard.number);
      delete reactOrder.creditcard.cvv;
      reactOrder.channels = trackers;
      return service.addOrder(reactOrder)
        .catch(function (err) {
          if (reactOrder.billing_status === 'completed') {
            return reactOrder;
          } else {
            throw err;
          }
        });
    });
};

ReactCRM.prototype.processSubscription = function processSubscription (processor, offer, creditCard, prospect) {
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
    .withCvv2(creditCard.cvv)
    .withCreditCardNumber(creditCard.number.replace(/\s/g, ''));

  prospect42 = cent42.createProspect({id: prospect.id})
    .withBillingFirstName(prospect.firstname)
    .withBillingLastName(prospect.lastname)
    .withBillingEmailAddress(prospect.email)
    .withBillingPhone(prospect.phone)
    .withBillingAddress1(billing.address)
    .withBillingCity(billing.city)
    .withBillingCountry(billing.country)
    .withBillingState(billing.region)
    .withBillingPostalCode(billing.zipcode)
    .withShippingFirstName(shipping.firstname)
    .withShippingLastName(shipping.lastname)
    .withShippingAddress1(shipping.address)
    .withShippingCity(shipping.city)
    .withShippingCountry(shipping.country)
    .withShippingState(shipping.region)
    .withShippingPostalCode(shipping.zipcode);

  //vault
  gateway = service.cent42.use(processor.cent42, processor.configuration);
  return gateway.createCustomerProfile(creditCard42, prospect42, prospect42, options)
    .then(function (customer) {
      //initial transaction with token
      prospect42.withProfileId(customer.profileId);
      creditCard.token = customer.profileId;
      reactOrder = {
        gateway_id: processor.id,
        prospect_id: prospect.id,
        offer_id: offer.id,
        shippingOfferId: offer.shippingOfferId,
        original_amount: offer.amount,
        converted_amount: offer.amount,
        ipAddress: {ip: prospect.source.ip},
        referer: prospect.source.referer,
        creditcard: creditCard,
        upsells: offer.upsells,
        billingAddressId: prospect.billing.id,
        shippingAddressId: prospect.shipping.id
      };
      reactOrder.creditcard.number = creditcard.truncate(reactOrder.creditcard.number);
      delete reactOrder.creditcard.cvv;
      return gateway.chargeCustomer({amount: offer.amount}, prospect42)
        .then(function success (res) {
          reactOrder.gateway_response = res;
          reactOrder.billing_status = 'completed';
          reactOrder.transaction_id = res.transactionId;
        }, function error (err) {
          reactOrder.billing_status = 'failed';
          reactOrder.gateway_response = err;
        });
    })
    .then(function () {
      return service.addOrder(reactOrder);
    })
    .then(function (ord) {
      reactOrder = ord;
      return service.api.subscriptions.create({refTransactionId: ord.id});
    })
    .then(function () {
      return reactOrder;
    })
    .catch(function (err) {
      reactOrder = {
        gateway_id: processor.id,
        prospect_id: prospect.id,
        offer_id: offer.id,
        shippingOfferId: offer.shippingOfferId,
        original_amount: offer.amount,
        converted_amount: offer.amount,
        ipAddress: {ip: prospect.source.ip},
        referer: prospect.source.referer,
        creditcard: creditCard,
        upsells: offer.upsells,
        billing_status: 'failed',
        gateway_response: err.message || 'unidentified error in the gateway'
      };
      reactOrder.creditcard.number = creditcard.truncate(reactOrder.creditcard.number);
      delete reactOrder.creditcard.cvv;
      return service.addOrder(reactOrder);
    });
};

ReactCRM.prototype.getOrder = function getOrder (id) {
  return this.api.orders.self(id);
};

ReactCRM.prototype.incrementVisits = function updateStoreFront (n) {
  var number = n || 1;
  var service = this;
  return service.getStoreFront()
    .then(function (camp) {
      return service.api.campaigns.update(camp.id, {visits: number})
    })
    .then(function (campaign) {
      service.campaign.visits = campaign.visits;
      return service.campaign;
    });
};

ReactCRM.prototype.addOrder = function addOrder (order) {
  var service = this;
  return this.getStoreFront()
    .then(function (campaign) {
      if (!order.campaign_id) {
        order.campaign_id = campaign.id;
      }
      return service.api.orders.create(order);
    });
};


module.exports = ReactCRM;

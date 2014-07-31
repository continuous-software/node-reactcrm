'use strict';

var request = require('request');
var rocketgate = require('rocketgate');
var virtualmerchant = require('virtualmerchant');

module.exports = NodeSDK;

NodeSDK.API_ENDPOINT = (process.env.API_1_PORT_8001_TCP_ADDR)
  ? "http://" + process.env.API_1_PORT_8001_TCP_ADDR + ":" + process.env.API_1_PORT_8001_TCP_PORT + "/api"
  : 'http://api.reactcrm.com/api';
NodeSDK.ACTION_AUTHENTICATE = '/authenticateApplication';
NodeSDK.ACTION_GET_APPLICATION = '/getApplication';
NodeSDK.ACTION_GET_STOREFRONT = '/getCampaign';
NodeSDK.ACTION_ADD_PROSPECT = '/addProspect';
NodeSDK.ACTION_ADD_ORDER = '/addOrder';

function NodeSDK(apiKey, apiSecret, callback) {
  var _this = this;
  _this.token = null;
  _this.storefront = null;
  if (!apiKey || !apiSecret) {
    var error = {code: 1, message: 'Missing arguments'};
    callback && callback(error);
    return error;
  }
  else if (typeof(apiKey) !== 'string' || typeof(apiSecret) !== 'string') {
    var error = {code: 2, message: 'Invalid arguments'};
    callback && callback(error);
    return error;
  }
  else
    return _this.authenticate(apiKey, apiSecret, function(error, result) {
      if (error)
        return callback && callback(error);
      if (result.error)
        return callback && callback(result.error);
      _this.token = result.token;
      return _this.initialize(function (error) {
        if (error)
          return callback && callback(error);
        if (result.error)
          return callback && callback(result.error);
        _this.storefront = result;
        return callback && callback(null);
      });
    });
};

NodeSDK.prototype.process = function(action, parameters, callback) {
  var endpoint = NodeSDK.API_ENDPOINT + action;
  var data = (this.token) ? {
    qs: parameters,
    auth: { bearer: this.token }
  } : {
    qs: parameters
  };
  request(endpoint, data, function(error, response, body) {
    var result = (body) ? JSON.parse(body) : null;
    callback && callback(error, result);
  });
};

NodeSDK.prototype.authenticate = function(apiKey, apiSecret, callback) {
  var self = this;
  console.log('[react] authenticating');
  this.process(NodeSDK.ACTION_AUTHENTICATE, {
    apiKey: apiKey,
    apiSecret: apiSecret
  }, function(error, result) {
    callback && callback(error, result);
  });
};

NodeSDK.prototype.initialize = function(callback) {
  var self = this;
  console.log('[react] retrieving storefront informations');
  this.process(NodeSDK.ACTION_GET_STOREFRONT, {}, function(error, result) {
    callback && callback(error, result);
  });
};


NodeSDK.prototype.registerProspect = function(prospect, callback) {
  prospect.billing = JSON.stringify(prospect.billing);
  prospect.shipping = JSON.stringify(prospect.shipping);
  console.log('[react] registering prospect: %s', JSON.stringify(prospect));
  this.process(NodeSDK.ACTION_ADD_PROSPECT, prospect, function(error, result) {
    callback && callback(error, result);
  });
};

NodeSDK.prototype.processOrderWithRocketgate = function(gateway, offer, prospect, creditcard, callback) {
  var GatewayService = rocketgate.GatewayService;
  var GatewayRequest = rocketgate.GatewayRequest;
  var GatewayResponse = rocketgate.GatewayResponse;
  var service = new GatewayService();
  var request = new GatewayRequest();
  var response = new GatewayResponse();
  request.Set(GatewayRequest.MERCHANT_ID, gateway.merchant_id);
  request.Set(GatewayRequest.MERCHANT_PASSWORD, gateway.merchant_password);
  request.Set(GatewayRequest.CARDNO, creditcard.number.trim());
  var expiry = creditcard.expiration.split('/');
  request.Set(GatewayRequest.EXPIRE_MONTH, expiry[0].trim());
  request.Set(GatewayRequest.EXPIRE_YEAR, expiry[1].trim());
  request.Set(GatewayRequest.AMOUNT, offer.amount);
  request.Set(GatewayRequest.MERCHANT_CUSTOMER_ID, prospect.id);
  request.Set(GatewayRequest.MERCHANT_INVOICE_ID, "ReactCRMInv-1");
  request.Set(GatewayRequest.CUSTOMER_FIRSTNAME, prospect.firstname);
  request.Set(GatewayRequest.CUSTOMER_LASTNAME, prospect.lastname);
  request.Set(GatewayRequest.BILLING_ADDRESS, prospect.billing.address);
  request.Set(GatewayRequest.BILLING_CITY, prospect.billing.city);
  request.Set(GatewayRequest.BILLING_ZIPCODE, prospect.billing.zipcode);
  request.Set(GatewayRequest.BILLING_COUNTRY, prospect.billing.country);
  request.Set(GatewayRequest.BILLING_STATE, prospect.billing.region);
  request.Set(GatewayRequest.AVS_CHECK, "IGNORE");
  request.Set(GatewayRequest.CVV2, creditcard.cvv2);
  request.Set(GatewayRequest.CVV2_CHECK, "IGNORE");
  request.Set(GatewayRequest.EMAIL, prospect.email);
  request.Set(GatewayRequest.IPADDRESS, prospect.ip_address);
  request.Set(GatewayRequest.SCRUB, "IGNORE");
  service.SetTestMode(true);
  var self = this;
  var order = {
    gateway_id: gateway.id,
    prospect_id: prospect.id,
    offer_id: offer.id,
    amount: offer.amount,
    ip_address: prospect.ip_address,
    referer: prospect.referer,
    creditcard: JSON.stringify(creditcard)
  };
  service.PerformPurchase(request, response, function(status) {
    if (status) {
      order.billing_status = 'completed';
      order.transaction_id = response.Get(GatewayResponse.TRANSACT_ID);
      self.process(NodeSDK.ACTION_ADD_ORDER, order, function (error, result) {
        callback && callback(null, order);
      });
    }
    else {
      console.log(response);
      order.billing_status = 'failed';
      order.gateway_response = response.Get(GatewayResponse.REASON_CODE);
      self.process(NodeSDK.ACTION_ADD_ORDER, order, function (error, result) {
        callback && callback("Purchase failed!");
      });
    }
  });
};

NodeSDK.prototype.processOrderWithVirtualMerchant = function(options, order, prospect, callback) {
  var gateway = new virtualmerchant({
    merchant_id: options.merchant_id,
    user_id: options.user_id,
    ssl_pin: options.ssl_pin,
    test_mode: false
  });
  gateway.doPurchase({
    card_number: order.number,
    exp_date: order.expiration.split(' / ').join(''),
    amount: order.amount
  }, function(error, result) {
    if (error)
      return callback && callback(error);
    try {
      result = JSON.parse(result);
      return callback && callback(null, result.ssl_txn_id);
    }
    catch(e) {
      return callback(result);
    }
  });
};

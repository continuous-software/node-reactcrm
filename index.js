'use strict';

var request = require('request');
var rocketgate = require('rocketgate');

module.exports = NodeSDK;

NodeSDK.API_ENDPOINT = 'http://localhost:8001/api';
NodeSDK.ACTION_AUTHENTICATE = '/authenticateApplication';
NodeSDK.ACTION_GET_APPLICATION = '/getApplication';
NodeSDK.ACTION_GET_STOREFRONT = '/getCampaign';
NodeSDK.ACTION_ADD_PROSPECT = '/addProspect';
NodeSDK.ACTION_ADD_ORDER = '/addOrder';

function NodeSDK(apiKey, apiSecret, callback) {
  var _this = this;
  _this.token = null;
  _this.storefront = null;
  if (!apiKey || !apiSecret)
    return {code: 1, message: 'Missing arguments'};
  else if (typeof(apiKey) !== 'string' || typeof(apiSecret) !== 'string')
    return {code: 2, message: 'Invalid arguments'};
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
  console.log('[react] registering prospect: %s', JSON.stringify(prospect));
  this.process(NodeSDK.ACTION_ADD_PROSPECT, prospect, function(error, result) {
    callback && callback(error, result);
  });
};

NodeSDK.prototype.processOrder = function(options, order, prospect, callback) {
  var req = require('request');
  console.log('[react] processing order: %s', JSON.stringify(order));
  this.processOrderWithRocketgate(options, order, prospect, callback);
};

NodeSDK.prototype.processOrderWithRocketgate = function(options, order, prospect, callback) {
  var GatewayService = rocketgate.GatewayService;
  var GatewayRequest = rocketgate.GatewayRequest;
  var GatewayResponse = rocketgate.GatewayResponse;
  var service = new GatewayService();
  var request = new GatewayRequest();
  var response = new GatewayResponse();
  request.Set(GatewayRequest.MERCHANT_ID, options.merchant_id);
  request.Set(GatewayRequest.MERCHANT_PASSWORD, options.merchant_password);
  request.Set(GatewayRequest.CARDNO, order.number.trim());
  var expiry = order.expiry.split('/');
  request.Set(GatewayRequest.EXPIRE_MONTH, expiry[0].trim());
  request.Set(GatewayRequest.EXPIRE_YEAR, expiry[1].trim());
  request.Set(GatewayRequest.AMOUNT, 42.00);
  request.Set(GatewayRequest.MERCHANT_CUSTOMER_ID, prospect.id);
  request.Set(GatewayRequest.MERCHANT_INVOICE_ID, "ReactCRMInv-1");
  request.Set(GatewayRequest.CUSTOMER_FIRSTNAME, prospect.firstname);
  request.Set(GatewayRequest.CUSTOMER_LASTNAME, prospect.lastname);
  request.Set(GatewayRequest.BILLING_ADDRESS, prospect.address1);
  request.Set(GatewayRequest.BILLING_CITY, prospect.city);
  request.Set(GatewayRequest.BILLING_STATE, prospect.state);
  request.Set(GatewayRequest.BILLING_ZIPCODE, prospect.zipcode);
  request.Set(GatewayRequest.BILLING_COUNTRY, prospect.country);
  request.Set(GatewayRequest.AVS_CHECK, "IGNORE");
  request.Set(GatewayRequest.CVV2, order.cvc);
  request.Set(GatewayRequest.CVV2_CHECK, "IGNORE");
  request.Set(GatewayRequest.EMAIL, prospect.email);
  request.Set(GatewayRequest.IPADDRESS, "68.224.133.117");
  request.Set(GatewayRequest.SCRUB, "IGNORE");
  service.SetTestMode(true);
  var self = this;
  order.prospect_id = prospect.id;
  console.log(prospect);
  service.PerformPurchase(request, response, function(status) {
    if (status) {
      console.log("Purchase succeeded");
      console.log("GUID: " + response.Get(GatewayResponse.TRANSACT_ID));
      console.log("Response Code: " + response.Get(GatewayResponse.RESPONSE_CODE));
      console.log("Reason Code: " + response.Get(GatewayResponse.REASON_CODE));
      console.log("AuthNo: " + response.Get(GatewayResponse.AUTH_NO));
      console.log("AVS: " + response.Get(GatewayResponse.AVS_RESPONSE));
      console.log("CVV2: " + response.Get(GatewayResponse.CVV2_CODE));
      console.log("CardHash: " + response.Get(GatewayResponse.CARD_HASH));
      console.log("CardIssuer: " + response.Get(GatewayResponse.CARD_ISSUER_NAME));
      console.log("Account: " + response.Get(GatewayResponse.MERCHANT_ACCOUNT));
      console.log("Scrub: " + response.Get(GatewayResponse.SCRUB_RESULTS));
      order.status = 'success';
      order.token = response.Get(GatewayResponse.CARD_HASH);
      self.process(NodeSDK.ACTION_ADD_ORDER, order, function (error, result) {
        callback && callback(null, response.Get(GatewayResponse.TRANSACT_ID));
      });
    }
    else {
      order.status = 'failed';
      order.token = '';
      self.process(NodeSDK.ACTION_ADD_ORDER, order, function (error, result) {
        callback && callback("Purchase failed!");
      });
      console.log("Purchase failed");
      console.log("GUID: " + response.Get(GatewayResponse.TRANSACT_ID));
      console.log("Response Code: " + response.Get(GatewayResponse.RESPONSE_CODE));
      console.log("Reason Code: " + response.Get(GatewayResponse.REASON_CODE));
      console.log("Exception: " + response.Get(GatewayResponse.EXCEPTION));
      console.log("Scrub: " + response.Get(GatewayResponse.SCRUB_RESULTS));
    }
  });
};

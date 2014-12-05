var base = require('42-cent-base');
var util = require('util');
var Promise = require('bluebird');

function GatewayMock(options) {
  base.BaseGateway.call(this);
  this.options = options;
}

util.inherits(GatewayMock, base.BaseGateway);

GatewayMock.prototype.submitTransaction = function (order, cc, prospect, other) {

  var self = this;

  return GatewayMock.resolveValue ? Promise.resolve(GatewayMock.resolveValue).then(function (val) {
    GatewayMock.resolveValue = null;
    return val;
  }) : Promise.reject(GatewayMock.rejectValue || new Error('mock has no resolve value')).then(function (val) {
    GatewayMock.rejectValue = null;
    return val;
  });
};

GatewayMock.resolveWith = function resolveWith(val) {
  GatewayMock.resolveValue = val;
};

GatewayMock.rejectWith = function rejectValue(val) {
  GatewayMock.rejectValue = val;
};

module.exports = {
  factory: function (opt) {
    return new GatewayMock(opt);
  },
  GatewayMock: GatewayMock
};



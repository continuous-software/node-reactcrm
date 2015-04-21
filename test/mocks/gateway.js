var base = require('42-cent-base');
var util = require('util');
var P = require('bluebird');

function GatewayMock(options) {
  base.BaseGateway.call(this);
  this.options = options;
}

util.inherits(GatewayMock, base.BaseGateway);

GatewayMock.prototype.submitTransaction = function (order, cc, prospect, other) {

  var self = this;

  return GatewayMock.resolveValue ? P.resolve(GatewayMock.resolveValue).then(function (val) {
    GatewayMock.resolveValue = null;
    return val;
    }) : P.reject(GatewayMock.rejectValue || new Error('mock has no resolve value')).then(function (val) {
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



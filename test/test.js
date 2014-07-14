"use strict";

var should = require("should");
var continuous = require("continuous");

var service = new continuous.Service({
  apiKey: 000000,
  secretKey: 000000
});

service.billingForm()

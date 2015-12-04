var $ = require('skeemas-json-pointer');
module.exports = function replace (schema, defintions) {
  'use strict';
  var output = {};
  if (schema.$ref) {
    output = $(schema.$ref).get(defintions);
  } else if (typeof schema !== 'object') {
    output = schema;
  } else if (Array.isArray(schema)) {
    output = schema.map(s => replace(s, defintions));
  } else {
    for (let prop in schema) {
      const val = replace(schema[prop], defintions);
      output[prop] = val;
    }
  }
  return output;
};
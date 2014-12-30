var Promise = require('bluebird');

module.exports = function factory() {
  var prototype = {

    get: function get() {
      return Promise.resolve(this.value);
    },

    put: function put(val) {
      this.value = val;
      return Promise.resolve(val);
    }

  };

  return Object.create(prototype);
};

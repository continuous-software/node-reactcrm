'use strict';

exports.setup = function(app, controllers) {
  app.get('/', controllers.index);
  app.post('/', controllers.registerProspect);
  app.get('/bill', controllers.bill);
  app.post('/bill', controllers.processOrder);
  app.get('/confirmation', controllers.confirmation);
};

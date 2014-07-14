'use strict';

exports.index = function(req, res) {
  res.render('index');
};

exports.registerProspect = function(req, res) {
  req.app.get('react').registerProspect(req.body);
  res.redirect('/bill?prospect=' + encodeURIComponent(JSON.stringify(req.body)));
};

exports.bill = function(req, res) {
  res.render('bill', {
    prospect: req.query.prospect
  });
};

exports.processOrder = function(req, res) {
  req.app.get('react').processOrder(req.body, JSON.parse(req.body.prospect));
  res.redirect('/confirmation');
};

exports.confirmation = function(req, res) {
  res.render('confirmation');
};

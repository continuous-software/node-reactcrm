'use strict';

var express = require('express');
var body = require('body-parser');
var routes = require('./routes');
var controllers = require('./controllers');
var app = express();

app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// Including the SDK within the Express app.
var React = require('../');
var client = new React("091-30193-91961-64", "221-10956-24377-24", function(error) {
  console.log(error);
});
app.set('react', client);

routes.setup(app, controllers);
app.listen(3001, function() {
  console.log('Listening on port %d', this.address().port);
});

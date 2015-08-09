var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var OAuth2 = require('oauth').OAuth2;
var mongoose = require('mongoose');

var server_app = express();

// listen on port
var server = server_app.listen(4000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('server_app started at http://%s:%s', host, port);
});


server_app.use(bodyParser.json());
server_app.use(bodyParser.urlencoded({ extended: true }));


var dbConnectionString = 'mongodb://localhost/trendsTester';

mongoose.connect(dbConnectionString);

// connect twitter
var oauth2 = new OAuth2(
  'qSKC9NfhIcArbmlhn6Gf4TyhU',
  'WxxxdWmacaNJq2rw0SGNPwOP6DHC9iE8HAcHVLd6j8e582wrNH',
  'https://api.twitter.com/',
  null,
  'oauth2/token',
  null
);

module.exports.oauth2 = oauth2;

server_app.use(require('./routes'));


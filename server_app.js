var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var OAuth2 = require('oauth').OAuth2;
var mongoose = require('mongoose');

var server_app = express();

// listen on port
var server = server_app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('server_app started at http://%s:%s', host, port);
});


server_app.use(bodyParser.json());
server_app.use(bodyParser.urlencoded({ extended: true }));


var dbConnectionString = 'INSERT_DB_PATH';

mongoose.connect(dbConnectionString);

// connect twitter
var oauth2 = new OAuth2(
  'INSERT_KEY',
  'INSERT_PHRASE',
  'https://api.twitter.com/',
  null,
  'oauth2/token',
  null
);

module.exports.oauth2 = oauth2;

server_app.use(require('./routes'));


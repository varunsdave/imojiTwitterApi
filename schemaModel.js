var mongodb = require('mongoose');
var schema = mongodb.Schema;

var model = new schema({
	trendName: String,
	trendUrl: String
});

module.exports = mongodb.model('Tweet',  model);
var express = require('express');
var router = express.Router();
var url = require('url');
var oauth2 = require('./server_app').oauth2;
var Tweet = require('./schemaModel');
var request = require('superagent');

var getTopics = '/birdie/rest/topics';
var postTopics = '/birdie/rest/topics/load';
var singleTopic = '/birdie/rest/topic';
var trendLocation = 'https://api.twitter.com/1.1/trends/place.json?id=23424977';


//get one or more topics
router.get( getTopics, function(req, res) {
  var qData = url.parse(req.url, true).query;
  var q = qData.query;  
  if (q === undefined) {
      Tweet.find(function(err, trendNames) {
      return res.status(200).json(trendNames);
    });
  } else {
    Tweet.find({ trendName: new RegExp('^' + q, 'i')}, function(err, trendNames) {
      //console.log(trendNames);
      return res.status(200).json(trendNames);
    
    });
  }
});

// console.log('entering api router');
router.get('/', function(req,res){
  res.send('Hello Tom or another person from imoji router');
});

// insert a topic
router.post('/birdie/rest/topic/:trend_id', function(req, res) {
  var tName = req.params.trend_id;
  if (tName === undefined){
    console.log("invalid data");
    return res.status(406);
  }
  console.log("adding new request "+tName);
  Tweet.create(
  {
     trendName: tName
  }, function(trend) {
    if (err) { 
      return console.log('Error: can\'t write', err) 
    }
    return res.sendStatus(200, "OKAY");
  });
});


// remove a topic
router.delete('/birdie/rest/topic/:trend_id', function(req, res) {
  console.log(req.params.trend_id);
  var tName = req.params.trend_id;
  if (tName === undefined){
    console.log("undefined query");
    return res.sendStatus(406);
  }
  Tweet.remove({ trendName: tName }, function(err) {
    return res.status(204).end();
  });
});



// grab all topics from twitter
router.post( postTopics, function(req, res) {
  oauth2.getOAuthAccessToken(
    '',
    {'grant_type': 'client_credentials'},
    function(err, oauthToken, oauthTokenSecret, results){
    if (err){
      res.send("Error with oauth", 500);
    }
    else{
        request.get(trendLocation)
        .set('Authorization','Bearer '+oauthToken).
        end(function(err, rest){
          if (err){
            console.log("issues with getting trends authoendtication connection");
          }
          var trends = rest.body[0].trends;
            trends.forEach(function(trend) {
              var trends = rest.body[0].trends;
              res.send(trends.name , 200);
              Tweet.create({ trendName: trend.name,
              trendUrl :trend.url });
            });
        });
      res.sendStatus(200,"Received trends");
    }
  });
});


module.exports = router;

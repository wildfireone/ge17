/**
* @Author: John Isaacs <john>
* @Date:   12-May-172017
* @Filename: debates.js
 * @Last modified by:   john
 * @Last modified time: 06-Jun-172017
*/

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var date = require('date-and-time');
var mongoURL = 'mongodb://localhost:27017/tweets';
var Twitter = require('twitter');
var counter = 0;
var hashcounter = require('./hashcounter');
var mentioncounter = require('./mentioncounter');
var hashspeccounter = require('./hashspeccounter');
var sentimentcounter = require('./sentimentcounter');
var sentigen = require('./sentigen');
//var endpoints = require('./endpoints');
var debateprefix = "debate_testZ";
var trackingtag = 'ge2017';

var client = new Twitter({
  consumer_key: 'r6zyjOV2sWUGYwbmLLL1GxCKl',
  consumer_secret: 'RLfja0iZWhuix2C6BZA6PVEi67vgZnCpZwnqLarh4fbSYWyZHW',
  access_token_key: '3005928321-kUEn5id86v8lleEtc0iprPUcZVVDdcSVUWdKTlE',
  access_token_secret: '7d9Xy7fSkYvTm90zvUeCuRpEM5X3g7syECGgcLpj0JiRi'
});
//start the hashcounter
var config =
{
  'prefix' : debateprefix,
  'MongoClient' : MongoClient,
  'mongoURL':mongoURL,
  'assert':assert,
  'date':date,
  'track':trackingtag,
  'delay':10000

}
hashcounter.start(config);
mentioncounter.start(config);
hashspeccounter.start(config);
try{
sentimentcounter.start(config);
sentigen.start(config);
}
catch(err){
  console.log(err);
}
//endpoints.start(config);


client.stream('statuses/filter', {track: trackingtag},  function(stream){

  stream.on('data', function(tweet) {
    try{sentigen.checkTweet(tweet);}
    catch (err){
      console.log(err);
    }

    //console.log(t)
    //console.log(tweet);
    MongoClient.connect(mongoURL, function(err, db) {
      assert.equal(null, err);
      insertDocument(db,tweet, function() {
        db.close();
      });
    });
});


  stream.on('error', function(error) {
    console.log(error);
  });
});

var insertDocument = function(db, newtweet, callback) {
    db.collection(debateprefix+'ge17').insertOne( newtweet, function(err, result) {
      assert.equal(err, null);
      //console.log("Inserted a document into the tweets collection.");
      callback();
    });
};

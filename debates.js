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
//var endpoints = require('./endpoints');
var debateprefix = "debate_test3";
var trackingtag = 'ge17';

var client = new Twitter({
  consumer_key: 'TC98w89JxQK2v4vPEqLLxJLx0',
  consumer_secret: 'le4t2JCgoT3CBZwToaKdOJx5LFYDDkGL5e3Pjl2ZtfTqYV46Fs',
  access_token_key: '4459846396-tU9aYf4E5r9eHhJnniU7OsyrLNJhzEd4cpVeFFe',
  access_token_secret: 'UaY6kpdXbdV7cAsAxrKLzFTkKSLtW8dcNTe1CYniUl6xM',
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
//endpoints.start(config);


client.stream('statuses/filter', {track: trackingtag},  function(stream){

  stream.on('data', function(tweet) {
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

/**
 * @Author: John Isaacs <john>
 * @Date:   15-Apr-172017
 * @Filename: app.js
* @Last modified by:   john
* @Last modified time: 24-Apr-172017
 */
var groups = [
'ConsFutureScot',
'RightsSCCYP',
'DundeeLabStu',
'EUSNA',
'eussps',
'EUCUA',
'gbinscotland',
'GirlguidingScot',
'YSIGlasgow',
'GULabourClub',
'GUTories',
'PoliticsSociety',
'gusna11',
'HYouthPar',
'LGBTYS',
'LYScotland',
'StirlingLY',
'nusScotland',
'OurGenScot',
'scotyounggreens',
'scotsyounglab',
'ScoutsScotland',
'SNPStudents',
'SNPyouth',
'StA_Tories',
'stausfi',
'StrathLabclub',
'OfficialSYP',
'TheBBScotland',
'UWSLabour',
'xchangescotland',
'YCLScotland',
'Yiscotland',
'YoungScot',
'YoungScotsUnion',
'YouthScotland',
'YouthLinkScot',
'youngwomenscot',
'CYPCS'];

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var mongoURL = 'mongodb://localhost:27017/tweets';
var Monitor = require('monitor-twitter');

// Your Twitter credentials
var config = {
    consumer_key: 'r6zyjOV2sWUGYwbmLLL1GxCKl',
    consumer_secret: 'RLfja0iZWhuix2C6BZA6PVEi67vgZnCpZwnqLarh4fbSYWyZHW',
    access_token: '3005928321-kUEn5id86v8lleEtc0iprPUcZVVDdcSVUWdKTlE',
    access_token_secret: '7d9Xy7fSkYvTm90zvUeCuRpEM5X3g7syECGgcLpj0JiRi'
};

var m = new Monitor(config);
var i =0;
groups.forEach(function(group){
  i++;
  setTimeout(function() { m.start(group, '', 60 * 1000);}, i*1000);
});


m.on('tweet',function(tweet) {
    //console.log('Received a tweet', tweet.account, tweet);
    MongoClient.connect(mongoURL, function(err, db) {
      assert.equal(null, err);
      insertDocument(db,tweet, function() {
        db.close();
      });
    });
});

var insertDocument = function(db, newtweet, callback) {
    db.collection(newtweet.account).insertOne( newtweet, function(err, result) {
      assert.equal(err, null);
      //console.log("Inserted a document into the tweets collection.");
      callback();
    });
};

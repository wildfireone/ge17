/**
 * @Author: John Isaacs <john>
 * @Date:   06-Jun-172017
 * @Filename: sentigen.js
 * @Last modified by:   john
 * @Last modified time: 06-Jun-172017
 */

var sentiment = require('sentiment');

module.exports = {
  start: function(config) {
    MongoClient = config.MongoClient;
    mongoURL = config.mongoURL;
    assert = config.assert;
    prefix = config.prefix;
    delay = config.delay;
    date = config.date;
    // call the rest of the code and have it execute after 3 seconds
    console.log("Sentiment started");
    MongoClient.connect(mongoURL, function(err, db) {
      db.collection(prefix + 'currentsentiment').update({
        name: "currentsentiment"
      }, {
        name: "currentsentiment",
        NS: 0,
        RD: 0,
        KD: 0,
        PH: 0,
        WR: 0,
        DC: 0,
        TM: 0,
        JC: 0,
        TF: 0,
        PN: 0
      }, {
        upsert: true
      }, function(err, result) {
        assert.equal(err, null);
        //console.log("Inserted a document into the tweets collection.");
        db.close();
      });
    });
  },
  checkTweet: function(tweet) {
    checkTweet(tweet);
  }
};

var accounts = ['NicolaSturgeon', 'RuthDavidsonMSP', 'kezdugdale', 'willie_rennie', 'patrickharvie', 'DavidCoburnUKip', 'theresa_may', 'jeremycorbyn', 'timfarron', 'paulnuttallukip'];


var checkTweet = function(tweet) {
  var currentscore = 0;
  var scores = [10];
  for (var k = 0; k < scores.length; k++) {
    scores[k] = 0;
  }
  var flag = false;
  for (var j = 0; j < tweet.entities.user_mentions.length; j++) {
    for (var i = 0; i < accounts.length; i++) {

      if (tweet.entities.user_mentions[j].screen_name == accounts[i]) {
        flag = true;
        if (currentscore == 0) {
          console.log("running sentiment");
          currentscore = sentiment(tweet.text).score;
          console.log("done " + JSON.stringify(currentscore));
        }
        scores[i] = currentscore;
      }
    }
  }

  if (flag) {
    console.log(scores);
    insertDocument(scores);
  }
}





var insertDocument = function(scores) {
  var now = new Date();
  var realtime = date.format(now, 'YYYY/MM/DD HH:mm:ss');

  MongoClient.connect(mongoURL, function(err, db) {
    db.collection(prefix + 'currentsentiment').update({
      name: "currentsentiment"
    }, {
      $inc: {
        NS: scores[1],
        RD: scores[2],
        KD: scores[3],
        PH: scores[4],
        WR: scores[5],
        DC: scores[6],
        TM: scores[7],
        JC: scores[8],
        TF: scores[9],
        PN: scores[10]
      }
    }, {
      upsert: true
    }, function(err, result) {
      assert.equal(err, null);
      //console.log("Inserted a document into the tweets collection.");
      db.close();
    });
  });
};

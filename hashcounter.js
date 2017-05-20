/**
* @Author: John Isaacs <john>
* @Date:   12-May-172017
* @Filename: hashcounter.js
* @Last modified by:   john
* @Last modified time: 13-May-172017
*/

var minutecounter =0;
//var delay = 60000;

module.exports = {
  start: function (config) {
    MongoClient = config.MongoClient;
    mongoURL = config.mongoURL;
    assert = config.assert;
    prefix = config.prefix;
    delay = config.delay;
    // call the rest of the code and have it execute after 3 seconds
    console.log("Hashcounter started");

    setTimeout(startstream, delay);
  }
};



function startstream(){
minutecounter++;
  console.log("starting Mongo Stream");
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
      findHashtags(minutecounter, db, function(minute) {
        db.close();
        console.log("added at "+minute);
      });

  });
  setTimeout(startstream, delay);
}


var findHashtags = function(minute,db, callback) {
  // Get the documents collection
  console.log(prefix+'ge17');
  var collection = db.collection(prefix+'ge17');
  // Find some documents
  collection.aggregate([{$unwind: '$entities.hashtags'},  { $group: {  _id: '$entities.hashtags.text',  tagCount: {$sum: 1}  }},   { $sort: {  tagCount: -1  }},   { $limit: 10 } ]).toArray(function(err, docs){

    assert.equal(err, null);
    insertDocument(minute,db,docs,function() {

      callback(minute);
    });


  });
}

var insertDocument = function(minute,db, docs, callback) {
  var data = {'minute':minute, 'counts':docs};
    db.collection(prefix +'debatehashcounts').insertOne( data, function(err, result) {
      assert.equal(err, null);
      //console.log("Inserted a document into the tweets collection.");
      callback();
    });
};

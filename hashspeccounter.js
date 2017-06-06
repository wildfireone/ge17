/**
* @Author: John Isaacs <john>
* @Date:   12-May-172017
* @Filename: hashcounter.js
 * @Last modified by:   john
 * @Last modified time: 06-Jun-172017
*/

var minutecounter =0;

//var accountsjson =
//{
//    "sturgeon":
//    "dugdale":
//    "davidson":
//    "rennie":
//    "coburn":
//    "harvie:":
//    "corbyn":
//    "may":
//    "fallon":
//    "nuttal":
//}

var tags = ['NHS','Brexit','Indyref2','VoteSNP'];

module.exports = {
  start: function (config) {
    MongoClient = config.MongoClient;
    mongoURL = config.mongoURL;
    assert = config.assert;
    prefix = config.prefix;
    delay = config.delay;
    date = config.date;
    // call the rest of the code and have it execute after 3 seconds
    console.log("hash spec counter started");

    setTimeout(startstream, delay);
  }
};



function startstream(){
minutecounter++;
  console.log("starting Mongo Stream");
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
      findTags(minutecounter, db, function(minute) {
        //db.close();
        //console.log("added at "+minute);
      });

  });
  setTimeout(startstream, delay);
}


var findTags = function(minute,db, callback) {
  // Get the documents collection
  console.log(prefix+'ge17');
  var collection = db.collection(prefix+'ge17');
  // Find some documents
//console.log(accounts);
var closecount =0;
tags.forEach(function(tag){
  collection.find({ 'entities.hashtags': { $elemMatch: { text: '/^'+tag+'$/i' } } }).count(function(err, count){
    //console.log(account+":"+count);
    insertDocument(minute,tag,count);
    closecount++;
    if(closecount >= tags.length){
      db.close();
    }
  });

});


}

var insertDocument = function(minute,account,count) {
  var now = new Date();
  var realtime  = date.format(now, 'YYYY/MM/DD HH:mm:ss');

  MongoClient.connect(mongoURL, function(err, db) {
  var data = {'minute':minute,'hashtag':tag, 'count':count, 'realtime': realtime};
    db.collection(prefix +'debatespectagcounts').insertOne( data, function(err, result) {
      assert.equal(err, null);
      //console.log("Inserted a document into the tweets collection.");
      db.close();
    });
  });
};

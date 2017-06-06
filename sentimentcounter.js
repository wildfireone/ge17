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

var accounts = ['NicolaSturgeon','RuthDavidsonMSP', 'kezdugdale','willie_rennie','patrickharvie','DavidCoburnUKip','theresa_may','jeremycorbyn','timfarron','paulnuttallukip'];

module.exports = {
  start: function (config) {
    MongoClient = config.MongoClient;
    mongoURL = config.mongoURL;
    assert = config.assert;
    prefix = config.prefix;
    delay = config.delay;
    date = config.date;
    // call the rest of the code and have it execute after 3 seconds
    console.log("mentioncounter started");

    setTimeout(startstream, delay);
  }
};



function startstream(){
minutecounter++;
  console.log("starting Mongo Stream");
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
      findSentiment(minutecounter, db, function(minute) {
        //db.close();
        //console.log("added at "+minute);
      });

  });
  setTimeout(startstream, delay);
}


var findSentiment = function(minute,db, callback) {
  // Get the documents collection
  //console.log(prefix+'ge17');
  var collection = db.collection(prefix+'currentsentiment');
  // Find some documents
//console.log(accounts);
var closecount =0;

  collection.findOne(function(err,data){
    assert.equal(err, null);
    //console.log(account+":"+count);
    insertDocument(minute,data);
  });




}

var insertDocument = function(minute,sentimentdata) {
  var now = new Date();
  var realtime  = date.format(now, 'YYYY/MM/DD HH:mm:ss');

  MongoClient.connect(mongoURL, function(err, db) {
  var data = {'minute':minute,'data':sentimentdata, 'realtime': realtime};
    db.collection(prefix +'sentimentcounts').insertOne( data, function(err, result) {
      assert.equal(err, null);
      console.log(data.data);
      db.close();
    });
  });
};

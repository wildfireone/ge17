// content of index.js
const http = require('http');
const port = 80;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var mongoUrl = 'mongodb://localhost:27017/tweets';

const requestHandler = (request, response) => {
  console.log(request.url)
  response.write('Server is up!\n');
	MongoClient.connect(mongoUrl, function(err, db) {
  		assert.equal(null, err);
  		response.write("Connected correctly to server \n");
		db.collection('ge17').count(function(err, count) {
		
		response.write("we have "+count+" tweets!");
      		db.close();
		response.end();
		});
	});

}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log('server is listening on '+ port)
});


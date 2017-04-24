/**
* @Author: John Isaacs <john>
* @Date:   24-Apr-172017
* @Filename: textserver.js
* @Last modified by:   john
* @Last modified time: 24-Apr-172017
*/



// content of index.js
const http = require('http');
const port = 80;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var mongoUrl = 'mongodb://localhost:27017/tweets';

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

const requestHandler = (request, response) => {
  console.log(request.url)
  response.write('Server is up!\n');
	MongoClient.connect(mongoUrl, function(err, db) {
  		assert.equal(null, err);
  		response.write("Connected correctly to server \n");
		db.collection('ge17').count(function(err, count) {

		response.write("we have "+count+" tweets!");
    for(var i=0; i<groups.length;i++){
      db.collection(groups[i]).count(function(err, count) {
        response.write(groups[i]+" has "+count+" tweets");
        console.log(i,groups.length,count);
        if(i == (groups.length -1)) {
          db.close();
          response.end();
        }
      });
    }

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

/**
 * @Author: John Isaacs <john>
 * @Date:   24-Apr-172017
 * @Filename: textserver.js
 * @Last modified by:   john
 * @Last modified time: 06-Jun-172017
 */



// content of index.js
const http = require('http');
const port = 80;
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var mongoURL = 'mongodb://localhost:27017/tweets';


var debateprefix = "debate_test4";
var prefix = debateprefix;
var trackingtag = 'ge17';

//request handeler for routes
const requestHandler = (request, response) => {
    console.log(request)
    if (request.url == "/hashdata") {
        getHashtags2(response);

    } else if (request.url == "/mentiondata") {
        getMentions2(response);

    }  else if (request.url == "/mentiondatas") {
        getMentions(response);

    }  else if (request.url == "/hashdatas") {
        getHashtags(response);

    }
    else if (request.url == "/hashdataspec") {
        getSpecificHashtags(response);

    }else if (request.url == "/hashdataspecific") {
        servePage(response, "client/hashtagsspec.html")

    }else if (request.url == "/hashtagsstacked") {
        servePage(response, "client/hashtagsstack.html")

    }else if (request.url == "/mentionsstacked") {
        servePage(response, "client/mentionsstack.html")

    }else if (request.url == "/hashtags") {
        servePage(response, "client/hashtags.html")

    }else if (request.url == "/mentions") {
        servePage(response, "client/mentions.html")

    }

    else if (request.url == "/mentionsclean") {
        servePage(response, "client/mentions-debaters.html")

    }
     else {
        serveStatic(response, request.url)
    }

}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log('server is listening on ' + port)
});






//serving static resources
var serveStatic = function(response, page) {
        fs.readFile("client" + page, function(err, file) {
            if (err) {
                //throw err;
                response.end();
            } else {
                if (page.split('.').pop() == "css") {
                    response.writeHead(200, {
                        "Content-Type": "text/css"
                    });
                } else if (page.split('.').pop() == "js") {
                    response.writeHead(200, {
                        "Content-Type": "text/javascript"
                    });
                } else if (page.split('.').pop() == "html") {
                    response.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                } else {
                    response.writeHead(200, {
                        "Content-Type": "text/plain"
                    });
                }


                response.write(file);
                response.end();
            }

        });
    }
    //serving specific pages
var servePage = function(response, page) {
    fs.readFile(page, function(err, html) {
        if (err) {
            throw err;
        }

        response.writeHeader(200, {
            "Content-Type": "text/html"
        });
        response.write(html);
        response.end();

    });
}



//peaks chart for mentions
var getSpecificHashtags = function(response) {
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        var labels = ['NHS','Brexit','Indyref2','VoteSNP'];
        var data = [];

        response.writeHeader(200, {
            "Content-Type": "application/json"
        });
        var collection = db.collection(prefix + 'debatespectagcounts');
        collection.find().toArray(function(err, documents) {
          var lastvalues = [];
            //console.log("prefix + 'debatementioncounts' " + JSON.stringify(documents));
            for (var i = 1; i < documents.length; i++) {

                var index = labels.indexOf(documents[i].hashtag);

                if(!data[index]){var dataline = []; data[index] = dataline;}
                var val = documents[i].count
                //getLastValue(data[index],documents[i].minute);
                if(lastvalues[index]){ val = documents[i].count - lastvalues[index];}
                lastvalues[index] = documents[i].count;
                    data[index].push({
                        "minute": documents[i].minute,
                        "value": val,
                        "realtime": documents[i].realtime
                    });

                  }
                // } else {
                //     labels.push(documents[i].account);
                //     index = labels.indexOf(documents[i].account);
                //     var dataline = [];
                //     data[index] = dataline;
                //     data[index].push({
                //         "minute": documents[i].minute,
                //         "value": documents[i].count,
                //     });
                // }


            var jsonresponse;
            try {
                jsonresponse = {
                    "labels": labels,
                    "data": data,
                    "trackingtag": trackingtag
                }

            } catch (err) {
                jsonresponse = {
                    "error": err,
                    "message": "no data refresh"
                };
            }

            //console.log(JSON.stringify(jsonresponse));
            response.write(JSON.stringify(jsonresponse));
            response.end();
            db.close();

        });
    });

}

//peaks chart for mentions
var getMentions2 = function(response) {
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        var labels = ['NicolaSturgeon','RuthDavidsonMSP', 'kezdugdale','willie_rennie','patrickharvie','DavidCoburnUKip','theresa_may','jeremycorbyn','timfarron','paulnuttallukip'];
        var data = [];

        response.writeHeader(200, {
            "Content-Type": "application/json"
        });
        var collection = db.collection(prefix + 'debatementioncounts');
        collection.find().toArray(function(err, documents) {
          var lastvalues = [];
            //console.log("prefix + 'debatementioncounts' " + JSON.stringify(documents));
            for (var i = 1; i < documents.length; i++) {

                var index = labels.indexOf(documents[i].account);

                if(!data[index]){var dataline = []; data[index] = dataline;}
                var val = documents[i].count
                //getLastValue(data[index],documents[i].minute);
                if(lastvalues[index]){ val = documents[i].count - lastvalues[index];}
                lastvalues[index] = documents[i].count;
                    data[index].push({
                        "minute": documents[i].minute,
                        "value": val,
                        "realtime": documents[i].realtime
                    });

                  }
                // } else {
                //     labels.push(documents[i].account);
                //     index = labels.indexOf(documents[i].account);
                //     var dataline = [];
                //     data[index] = dataline;
                //     data[index].push({
                //         "minute": documents[i].minute,
                //         "value": documents[i].count,
                //     });
                // }


            var jsonresponse;
            try {
                jsonresponse = {
                    "labels": labels,
                    "data": data,
                    "trackingtag": trackingtag
                }

            } catch (err) {
                jsonresponse = {
                    "error": err,
                    "message": "no data refresh"
                };
            }

            //console.log(JSON.stringify(jsonresponse));
            response.write(JSON.stringify(jsonresponse));
            response.end();
            db.close();

        });
    });

}
//stacking charts for mentions
var getMentions = function(response) {
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        var labels = ['NicolaSturgeon','RuthDavidsonMSP', 'kezdugdale','willie_rennie','patrickharvie','DavidCoburnUKip','theresa_may','jeremycorbyn','timfarron','paulnuttallukip'];
        var data = [];

        response.writeHeader(200, {
            "Content-Type": "application/json"
        });
        var collection = db.collection(prefix + 'debatementioncounts');
        collection.find().toArray(function(err, documents) {
            //console.log("prefix + 'debatementioncounts' " + JSON.stringify(documents));
            for (var i = 1; i < documents.length; i++) {

                var index = labels.indexOf(documents[i].account);

                if(!data[index]){var dataline = []; data[index] = dataline;}
                var val = documents[i].count
                //if(lastvalues[index]){ val = documents[i].count - lastvalues[index];}
                //lastvalues[index] = documents[i].count;
                    data[index].push({
                        "minute": documents[i].minute,
                        "value": val,
                        "realtime": documents[i].realtime
                    });

                  }
                // } else {
                //     labels.push(documents[i].account);
                //     index = labels.indexOf(documents[i].account);
                //     var dataline = [];
                //     data[index] = dataline;
                //     data[index].push({
                //         "minute": documents[i].minute,
                //         "value": documents[i].count,
                //     });
                // }


            var jsonresponse;
            try {
                jsonresponse = {
                    "labels": labels,
                    "data": data,
                    "trackingtag": trackingtag
                }

            } catch (err) {
                jsonresponse = {
                    "error": err,
                    "message": "no data refresh"
                };
            }

            //console.log(JSON.stringify(jsonresponse));
            response.write(JSON.stringify(jsonresponse));
            response.end();
            db.close();

        });
    });

}

var getLastValue = function(data,minute){

var ret =0;

  for(var i=0; i<data.length; i++){

    if(parseInt(data[i].minute) == (parseInt(minute)-1)){

      ret =  data[i].value;

    }
  }
  return ret;
}
//stacking chart for hashtags
var getHashtags = function(response) {
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        var labels = [];
        var data = [];
        var trackingtotals = [];
        response.writeHeader(200, {
            "Content-Type": "application/json"
        });
        var collection = db.collection(prefix + 'debatehashcounts');
        collection.find().toArray(function(err, documents) {

            for (var i = 0; i < documents.length; i++) {
                for (var j = 0; j < documents[i].counts.length; j++) {
                    //console.log(documents[i].counts[j]["_id"]);
                    if (documents[i].counts[j]["_id"].toLowerCase() == trackingtag.toLowerCase()) {
                        if (trackingtotals.length < i) {
                            trackingtotals.push({
                                "minute": i,
                                "value": documents[i].counts[j]["tagCount"],
                                "realtime": documents[i].realtime
                            });
                        }
                    } else {
                        var index = labels.indexOf(documents[i].counts[j]["_id"]);
                        if (index > -1) {
                            data[index].push({
                                "minute": i,
                                "value": documents[i].counts[j]["tagCount"],
                                "realtime": documents[i].realtime
                            });
                        } else {
                            labels.push(documents[i].counts[j]["_id"]);
                            index = labels.indexOf(documents[i].counts[j]["_id"]);
                            var dataline = [];
                            data[index] = dataline;
                            data[index].push({
                                "minute": i,
                                "value": documents[i].counts[j]["tagCount"],
                                "realtime": documents[i].realtime
                            });
                        }
                    }
                }


            }
            //console.log(labels);
            //console.log(JSON.stringify(data));
            var jsonresponse;
            try {
                jsonresponse = {
                    "labels": labels,
                    "data": data,
                    "trackingtotals": trackingtotals,
                    "trackingtag": trackingtag
                }

            } catch (err) {
                jsonresponse = {
                    "error": err,
                    "message": "no data refresh"
                };
            }
            //console.log(JSON.stringify(jsonresponse));
            response.write(JSON.stringify(jsonresponse));
            response.end();
            db.close();

        });
    });

}
//peaks chart for hashtags
var getHashtags2 = function(response) {
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        var labels = [];
        var data = [];
        var trackingtotals = [];
        response.writeHeader(200, {
            "Content-Type": "application/json"
        });
        var collection = db.collection(prefix + 'debatehashcounts');
        collection.find().toArray(function(err, documents) {

            for (var i = 1; i < documents.length; i++) {
                for (var j = 0; j < documents[i].counts.length; j++) {
                    //console.log(documents[i].counts[j]["_id"]);
                    if (documents[i].counts[j]["_id"].toLowerCase() == trackingtag.toLowerCase()) {
                        if (trackingtotals.length < i) {
                            var value;
                            if (documents[i - 1].counts[j]) {
                                value = documents[i].counts[j]["tagCount"] - documents[i - 1].counts[j]["tagCount"];
                            } else {
                                value = documents[i].counts[j]["tagCount"];
                            }
                            trackingtotals.push({
                                "minute": i,
                                "value": value,
                                "realtime": documents[i].realtime
                            });
                        }
                    } else {
                        var index = labels.indexOf(documents[i].counts[j]["_id"]);
                        if (index > -1) {
                            var value;
                            if (documents[i - 1].counts[j]) {
                                value = documents[i].counts[j]["tagCount"] - documents[i - 1].counts[j]["tagCount"];
                            } else {
                                value = documents[i].counts[j]["tagCount"];
                            }
                            data[index].push({
                                "minute": i,
                                "value": value,
                                "realtime": documents[i].realtime
                            });
                        } else {
                            labels.push(documents[i].counts[j]["_id"]);
                            index = labels.indexOf(documents[i].counts[j]["_id"]);
                            var dataline = [];
                            data[index] = dataline;

                            var value;
                            if (i > 0 && documents[i - 1].counts[j]) {
                                value = documents[i].counts[j]["tagCount"] - documents[i - 1].counts[j]["tagCount"];
                            } else {
                                value = documents[i].counts[j]["tagCount"];
                            }
                            data[index].push({
                                "minute": i,
                                "value": value,
                                "realtime": documents[i].realtime
                            });
                        }
                    }
                }


            }


            //console.log(labels);
            //console.log(JSON.stringify(data));
            var jsonresponse;
            try {
                jsonresponse = {
                    "labels": labels,
                    "data": data,
                    "trackingtotals": trackingtotals,
                    "trackingtag": trackingtag
                }

            } catch (err) {
                jsonresponse = {
                    "error": err,
                    "message": "no data refresh"
                };
            }
            //console.log(JSON.stringify(jsonresponse));
            response.write(JSON.stringify(jsonresponse));
            response.end();
            db.close();

        });
    });

}



var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1,
                index = -1;

            for (i = 0; i < this.length; i++) {
                var item = this[i];

                if ((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

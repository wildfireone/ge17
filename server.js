/**
 * @Author: John Isaacs <john>
 * @Date:   07-Jun-172017
 * @Filename: server.js
 * @Last modified by:   john
 * @Last modified time: 07-Jun-172017
 */



/**
 * Created by John on 26/06/2015.
 */
//Lets require/import the HTTP module
var http = require('http');
var request = require("request");
var url = require('url') ;

var host = 'localhost',
    port = 7474;

//Create a db object. We will using this object to work on the DB.
var httpUrlForTransaction = 'http://' + host + ':' + port + '/db/data/transaction/commit';

//Lets define a port we want to listen to
const PORT=5050;

//We need a function which handles requests and send response
function handleRequest(request, response){
  console.log("dealing with "+request);
    var queryObject = url.parse(request.url,true).query;
    if(queryObject.custom){
        querytext = queryObject.custom;
    }
    else {
        var incHashtag = true;
        var incUser = false;
        var incTweet = false;
        var incRetweet = true;
        var limitCounts = true;
        var countLimit = 1;
        var filterTags = false;
        var tagFilter = "";

        //generate paths for each node
        var tagpath = 'tagpath = (tag:Hashtag)-[h]->(tweet:Tweet)';
        var tweetpath = 'tweetpath = (retweet:Tweet)-[r]->(tweet:Tweet)';
        var userpath = 'userpath =(user:User)-[p]->(retweet:Tweet)-->(tweet:Tweet)<-[pr]-(user2:User)';


        //build up query based on selection
        var querytext = 'MATCH ';

        if (incUser) {
            querytext += userpath + ',';
        }
        else if (incTweet) {
            querytext += tweetpath + ',';
        }
        if (incHashtag) {
            querytext += tagpath + ',';
        }

        //trim and remove extra comma
        querytext = querytext.replace(/,\s*$/, "");

        //querytext+=' WITH';
        //if(incUser){querytext +='  userpath as userpath, p as p,';}
        //if(incTweet){querytext +=' tweetpath as tweetpath, r as r,';}
        //if(incHashtag){querytext +=' tagpath as tagpath, h as h,';}

        //if(limitCounts){
        //    if(incUser){querytext +=' count(p) as paths WHERE (paths >'+countLimit+',)';}
        //   else if(incTweet){querytext +=' count(r) as paths WHERE (paths >'+countLimit+'),';}
        //   else if(incHashtag){querytext +=' count(h) as paths WHERE (paths >'+countLimit+'),';}
        // }

        //trim and remove extra commap
        // querytext = querytext.replace(/,\s*$/, "");

        if (incHashtag && filterTags) {
            if (limitCounts) {
                querytext += ' AND NOT (tag.name =' + tagFilter + ')';
            }
            else {
                querytext += ' WHERE NOT (tag.name =' + tagFilter + ')';
            }
        }
        //build return statement
        querytext += ' RETURN ';
        if (incUser) {
            querytext += ' userpath' + ',' + 'count(p)' + ',' + 'count(pr)' + ',';
        }
        else if (incTweet) {
            querytext += ' tweetpath' + ',' + 'count(r)' + ',';
        }
        if (incHashtag) {
            querytext += ' tagpath' + ',' + 'count(h)' + ',';
        }
        querytext = querytext.replace(/,\s*$/, "");

        //if (incUser) {
        //    querytext += ' ORDER BY COUNT(p) DESC';
        //}
        //else if (incHashtag) {
        //    querytext += ' ORDER BY COUNT(h) DESC';
        //}
        //else {
        //    querytext += ' ORDER BY COUNT(r) DESC';
        //}
        querytext += ' ORDER BY tweet.created_at'



        //var querytext = 'MATCH (n)-[r]-(m)';
        var matchtext = '';
    }
        //querytext += ' WHERE n:User OR m:User OR n:Hashtag OR m:Hashtag OR n:Tweet OR m:Tweet RETURN n,m,r,count(r) ORDER BY COUNT(r) DESC';
        if (queryObject.limit) {
            querytext += ' LIMIT ' + queryObject.limit;
        }


    runCypherQuery(
        querytext, function (err, resp) {
            if (err) {
                console.log(err);
            } else {
                var nodes=[], links=[];
                console.log(resp);
                resp.results[0].data.forEach(function (row) {
                    row.graph.nodes.forEach(function (n) {

                        if (idIndex(nodes,n.id) == null) {

                                //console.log(n);
                                if (n.labels[0] == "Tweet" ) {
                                  if(n.properties.type == "Tweet") {
                                      nodes.push({
                                          id: n.id,
                                          title: n.properties.created_at,
                                          label: n.properties.type,
                                          created: n.properties.created_at,
                                          eu: 'both',
                                          distance: 1
                                      });
                                  }
                                  else{
                                      nodes.push({
                                          id: n.id,
                                          title: n.properties.created_at,
                                          label: n.properties.type,
                                          created: n.properties.created_at,
                                          eu: 'both',
                                          distance: 1.5
                                      });
                                  }


                                }
                                else if(n.labels[0] == "User"){
                                    nodes.push({id: n.id, title: n.properties.screen_name, label: n.labels[0], distance: 1});
                                }
                                else if(n.labels[0] == "Hashtag"){
                                    nodes.push({id: n.id, title: n.properties.name, label: n.labels[0], created: n.properties.created_at, distance: 2});
                                }
                                else {
                                    nodes.push({id: n.id, label: n.labels[0], distance: 1});
                                }

                        }
                    });

                    links = links.concat( row.graph.relationships.map(function(r) {
                       // console.log(idIndex(nodes,r.startNode)+":"+idIndex(nodes,r.endNode)+":"+ r.type);

                        return {source:idIndex(nodes,r.startNode), start:idIndex(nodes,r.startNode),target:idIndex(nodes,r.endNode),end:idIndex(nodes,r.endNode),type:r.type};
                    }));
                });
                var viz = {nodes:nodes, links:links};

                response.writeHead(200, {"Content-Type": "application/javascript"});
                response.write(queryObject.callback+"("+JSON.stringify(viz)+")");
                response.end();
            }
        }
    );

}

function idIndex(a,id) {
    for (var i=0;i<a.length;i++) {
        if (a[i].id == id) return i;}
    return null;
}


//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});



//Let’s define a function which fires the cypher query.
function runCypherQuery(query, callback) {
    console.log("Query Posted!  : " +query);
    request.post({
            uri: httpUrlForTransaction,
            json: {statements: [{statement: query, resultDataContents :["graph"]}]}
        },
        function (err, res, body) {
            callback(err, body);
        })
}

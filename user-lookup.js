/**
* @Author: John Isaacs <john>
* @Date:   27-Apr-172017
* @Filename: user-lookup.js
* @Last modified by:   john
* @Last modified time: 27-Apr-172017
*/
var Twitter = require('twitter');
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('mps.json', 'utf8'));

var users =[];
//console.log(obj);

var client = new Twitter({
  consumer_key: 'TC98w89JxQK2v4vPEqLLxJLx0',
  consumer_secret: 'le4t2JCgoT3CBZwToaKdOJx5LFYDDkGL5e3Pjl2ZtfTqYV46Fs',
  access_token_key: '4459846396-tU9aYf4E5r9eHhJnniU7OsyrLNJhzEd4cpVeFFe',
  access_token_secret: 'UaY6kpdXbdV7cAsAxrKLzFTkKSLtW8dcNTe1CYniUl6xM',
});

var myJsonString ="";
var count =0;
fs.appendFileSync('mpuserobjects.json', '[\n');
for (var i = 0; i < obj.length; i++) {
  var username = obj[i].name.substring(1, obj[i].name.length-1);
  var params = {screen_name: username};
  client.get('users/lookup', params, function(error, response) {
    if (!error) {
      //users.push(response);
      fs.appendFileSync('mpuserobjects.json', JSON.stringify(response[0])+",\n");
      console.log(response);
      count++;
      if(count==obj.length){
      fs.appendFileSync('mpuserobjects.json', ']');
      }
    }
    else{count++;console.log(error);console.log(count);}
  });
}





//var params = {screen_name: 'nodejs'};

//client.get('users/lookup', params, function(error, response) {
//  if (!error) {/
//    console.log(response);
//  }
//});

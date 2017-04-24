/**
 * @Author: John Isaacs <john>
 * @Date:   15-Apr-172017
 * @Filename: app.js
* @Last modified by:   john
* @Last modified time: 24-Apr-172017
 */



var Monitor = require('monitor-twitter');

// Your Twitter credentials
var config = {
    consumer_key: 'r6zyjOV2sWUGYwbmLLL1GxCKl',
    consumer_secret: 'RLfja0iZWhuix2C6BZA6PVEi67vgZnCpZwnqLarh4fbSYWyZHW',
    access_token: '3005928321-kUEn5id86v8lleEtc0iprPUcZVVDdcSVUWdKTlE',
    access_token_secret: '7d9Xy7fSkYvTm90zvUeCuRpEM5X3g7syECGgcLpj0JiRi'
};

var m = new Monitor(config);


// Watch the account '_matthewpalmer' for Tweets containing 'http' every 30 seconds.
m.start('wildfireone', '', 30 * 1000);

m.on(function(tweet) {
    console.log('Received a tweet', tweet.account);
});

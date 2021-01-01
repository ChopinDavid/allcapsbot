var Twitter = require('twitter');
require('dotenv').config();
console.log({
  consumer_key: process.env.consumer_key, /*API key*/
  consumer_secret: process.env.consumer_secret, /*API key secret*/
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

var client = new Twitter({
  consumer_key: process.env.consumerKey, /*API key*/
  consumer_secret: process.env.consumerSecret, /*API key secret*/
  access_token_key: process.env.accessTokenKey,
  access_token_secret: process.env.accessTokenSecret
});

var stream = client.stream('statuses/filter', {track: 'mf doom'});
stream.on('data', function(event) {
  var tweetString;
  if (event.truncated) {
    tweetString = event.extended_tweet.full_text;
  } else {
    tweetString = event.text;
  }

  if (!event.retweeted_status && !event.is_quote_status) {
    var hasLowercasedDOOM = false;
    for (var i=0; i<tweetString.length - 7; i++) {
      if (tweetString.substr(i, 7).toLowerCase() == 'mf doom' && tweetString.substr(i, 7) != 'MF DOOM') {
        hasLowercasedDOOM = true;
        console.log(event);
      }
    }
    if (hasLowercasedDOOM) {
      client.post('statuses/update', {
        in_reply_to_status_id: event.id_str,
        status: '@' + event.user.screen_name + ' MF DOOM*'
      }, function(error, tweet, response) {
        if (error) {
          console.log(error);
        } else {
          let time = new Date().toLocaleString();
          console.log("Tweet sent: \"" + '@' + event.user.screen_name + ' MF DOOM*' + "\"\n    at: " + time);
        };
      });
      
    }
  }
});
 
stream.on('error', function(error) {
  console.log(error);
  throw error;
});
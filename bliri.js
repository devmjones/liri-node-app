/**
 * Created by devon.jones on 7/14/17.
 */

var Spotify = require('node-spotify-api');
var request = require('request');
var Twitter = require('twitter');
var fs = require('fs');
var keys = require('./keys.js');
var myTwitterKeys = keys.twitterKeys;
var mySpotifyKeys = keys.spotifyKeys;


var userInput = process.argv[2];
var arg = process.argv[3];


  var client = new Twitter({
    consumer_key: myTwitterKeys.consumer_key,
    consumer_secret: myTwitterKeys.consumer_secret,
    access_token_key: myTwitterKeys.access_token_key,
    access_token_secret: myTwitterKeys.access_token_secret
  });

  var getTweets = function(){
    client.get('https://api.twitter.com/1.1/search/tweets.json?q=bliri_bot&count=20', function(error, tweets) {
      var allTweets = tweets.statuses;
      for (tweet in allTweets){
        console.log("The words: " + allTweets[tweet].text);
        console.log("The date the words were born: " + allTweets[tweet].created_at);
      }
    });
  };

  var spotify = new Spotify({
      id: mySpotifyKeys.client_id,
      secret: mySpotifyKeys.client_secret
});

  var spotifyIt = function(){
    var songName = arg;

    if (arg === undefined){
      songName = "The Sign"
    }

    spotify.search({ type: 'track', query: songName, market: 'US' }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      var dataArray = data.tracks.items;
      console.log("Wow...Your taste in music is...questionable.  Your limited options for this bad song are: ")
      for(var i=0; i< dataArray.length; i++){
        console.log (songName + " on the sucky album " + dataArray[i].name,
          " by the over-rated ", dataArray[i].album.artists[0].name, " at ", dataArray[i].href);
      }

    });
  };

  var movieIt = function(){
    var moviename = arg;

    if (arg === undefined){
      moviename = "Mr. Nobody"
    }
    var omdbUrl = "http://www.omdbapi.com/?t=" + moviename + "&plot=short&tomatoes=true&apikey=40e9cece";
    request(omdbUrl, function(error, response, body) {

      if (!error && response.statusCode === 200) {
        console.log("UGH, that movie SUCKS....");
        console.log("It's crappy title: " + JSON.parse(body).Title);
        console.log("The horrible year it came out: " + JSON.parse(body).Year);
        console.log("Fake news IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
        console.log("Back-asswards country produced it: " + JSON.parse(body).Country);
        console.log("Sub-par language: " + JSON.parse(body).Language);
        console.log("Plot Summary (Hint: everybody dies): " + JSON.parse(body).Plot);
        console.log("Worthless Actors: " + JSON.parse(body).Actors);
        console.log("Seriously?! You want more? Fine. Rotten Tomato url: " + JSON.parse(body).tomatoURL);
      }
    });
  };

  var doIt = function(){
    fs.readFile("random.txt", "utf8", function(error, data) {

      if (error) {
        return console.log(error);
      }
      var dataArr = data.split(",");
      userInput = dataArr[0];
      arg= dataArr[1];

      if (userInput === "spotify-this-song"){
        spotifyIt();
      }
      else{
        movieIt();
      }
    });
  };

  switch (userInput) {
    case "my-tweets":
      getTweets();
      break;
    case "spotify-this-song":
      spotifyIt();
      break;
    case "movie-this":
      movieIt();
      break;
    case "do-what-it-says":
      doIt();
      break;
  }









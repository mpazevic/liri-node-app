//PRIMARY VARIABLES___________________________________________________________________________
var twitterKeyFile = require("./keys.js");
//API access keys for Twitter
var accessKeysTwitter = twitterKeyFile.twitterKeys;
//Include Twitter
var Twitter = require("twitter");
var client = new Twitter(accessKeysTwitter);
//Include moment.js for formatting times appropriately
var moment = require("moment");
//Include Spofity
var spotify = require("spotify");
//END PRIMARY VARIABLES___________________________________________________________________________

//Main liri function--immediately invoked upon entering a command
(function liri() {

	if (process.argv[2] === "my-tweets") {
		// Acquire 20 latest tweets under my user name and format times appropriately
		client.get('search/tweets', { q: "mpazevic", count: 20}, function(error, tweets, response) {
			if (error) {
				throw error;
			};
			for (var i = 0; i < tweets.statuses.length; i++) {
				console.log("");
				console.log("Text: " + tweets.statuses[i].text);
				console.log("Date created on: " + moment(new Date(tweets.statuses[i].created_at)).format('LLLL'));
			};
		});
	}

	if (process.argv[2] === "spotify-this-song") {
		spotifySearch();
	}

})();

//SPOTIFY______________________________________________________________________________
//Create a song query from user input
function songQueryString() {
	var queryString = '';
	for (var i = 3; i < (process.argv).length; i++) {
		queryString += " " + process.argv[i];
	}

	//Return "The Sign" by Ace of Base if the user does not input anything
	if (queryString === '') {
		return "the sign ace of base";
	} else {
		return queryString.trim();
	}
};

//Search Spotify using the spotify node--returns most popular result
//DOES NOT ACCOUNT FOR APOSTROPHES IN SONG TITLE (EX: "I'm in love")
function spotifySearch() {
		spotify.search({ type: 'track', query: songQueryString() }, function(err, data) {

			if ( err ) {
				console.log('Error occurred: ' + err);
				return;
			}

			console.log("");
			console.log("Artist(s') name(s): " + data.tracks.items[0].artists[0].name);
			console.log("Song title: " + data.tracks.items[0].name);
			console.log("Preview URL: " + data.tracks.items[0].preview_url); 
			console.log("Album: " + data.tracks.items[0].album.name);
			console.log("");

		});
}
//END SPOTIFY_______________________________________________________________________________









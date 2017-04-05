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
//Include Request 
var request = require("request");
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
		//Search requested song on Spotify
		spotifySearch();
	}

	if (process.argv[2] === "movie-this") {
		var request = require('request');
		var movieName = imdbString();
		let queryString = 'http://www.omdbapi.com/?' + "&t=" + movieName
		var rottenTomatoesURL = 'https://www.rottentomatoes.com/m/' + RTString();
		request( queryString, function (error, response, body) {
			if (error) {
				console.log('error:', error); // Print the error if one occurred 
			};
			//Make the returned data into a JSON object 
			var parsedBody = JSON.parse(body);
			console.log("\n" + "Movie Title: " + parsedBody.Title + "\n" + "Year Released: " + parsedBody.Year + "\n" + 
				"IMDB rating: " + parsedBody.Ratings[0].Value + "\n" + "Country(ies) Produced In: " + parsedBody.Country + "\n" + 
				"Language: " + parsedBody.Language + "\n" + "Plot: " + parsedBody.Plot + "\n" +
				"Actors: " + parsedBody.Actors + "\n" + "Rotten Tomatoes Rating: " +
				parsedBody.Ratings[1].Value + "\n" + "Rotten Tomatoes URL: " + rottenTomatoesURL + "\n"
			);
		});
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

//IMDB FUNCTIONS____________________________________________________________________________
function imdbString() {
	var queryString = '';
	for (var i = 3; i < (process.argv).length; i++) {
		queryString += " " + process.argv[i];
	};

	if (queryString === '') {
		return "Mr. Nobody";
	} else {
		return queryString.trim();
	}
};

//Format RT string correctly for use in the API
function RTString() {
	return imdbString().toLowerCase().replace(/\s+/g,"_").replace(".", "");
}
//END IMDB FUNCTIONS________________________________________________________________________








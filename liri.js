//PRIMARY VARIABLES___________________________________________________________________________
var twitterKeyFile = require("./keys.js");
//API access keys for Twitter
var accessKeysTwitter = twitterKeyFile.twitterKeys;
//Include Twitter
var Twitter = require("twitter");
var client = new Twitter(accessKeysTwitter);
//Include moment.js for formatting times appropriately
var moment = require("moment");
var spotify = require("spotify");
//Include Request for imdb API calls 
var request = require("request");
//Include fs
var fs = require("fs");
//END PRIMARY VARIABLES___________________________________________________________________________

var liriObject = {

	//Execute a specific function
	runLiri: function() {
		if (process.argv[2] === "my-tweets") {
			liriObject.findMyTweets();
		};

		if (process.argv[2] === "spotify-this-song") {
			liriObject.spotifySearch();
		};

		if (process.argv[2] === "movie-this") {
			liriObject.movieThis();
		};

		if (process.argv[2] === "do-what-it-says") {
			liriObject.doWhatItSays();
		};
	},

	// Acquire 20 latest tweets under my user name and format times appropriately
	findMyTweets: function() {
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
	},

	//Create a song query from user input
	spotifyQueryString: function() {
		var queryString = '';
		for (var i = 3; i < (process.argv).length; i++) {
			queryString += " " + process.argv[i];
		}

		//Return "The Sign" by Ace of Base if the user does not input anything
		if (queryString === '') {
			return "the sign ace of base";
		} else {
			return queryString.trim();
		};
	},

	//Search Spotify using the spotify node--returns most popular result
	spotifySearch: function() {
		spotify.search({ type: 'track', query: liriObject.spotifyQueryString() }, function(err, data) {

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
	},

	imdbString: function() {
		var queryString = '';
		for (var i = 3; i < (process.argv).length; i++) {
			queryString += " " + process.argv[i];
		};

		if (queryString === '') {
			return "Mr. Nobody";
		} else {
			return queryString.trim();
		};
	},

	//Format RT string correctly for use in the API
	RTString: function() {
		return liriObject.imdbString().toLowerCase().replace(/\s+/g,"%20").replace(/,/g, "%2C").replace(/:/g, "%3A");
	},

	movieThis: function() {
		var movieName = liriObject.imdbString();
		let queryString = 'http://www.omdbapi.com/?' + "&t=" + movieName;
		var rottenTomatoesURL = 'https://www.rottentomatoes.com/search/?search=' + liriObject.RTString();
		request( queryString, function (error, response, body) {
			if (error) {
				console.log('error:', error); // Print the error if one occurred 
			};
			//Make the returned data into a JSON object 
			var parsedBody = JSON.parse(body);
			//See if the movie title exists and print facts about it if true.
			//If false, return a specific error message
			try {
				console.log("\n" + "Movie Title: " + parsedBody.Title + "\n" + "Year Released: " + parsedBody.Year + "\n" + 
				"IMDB rating: " + parsedBody.Ratings[0].Value + "\n" + "Country(ies) Produced In: " + parsedBody.Country + "\n" + 
				"Language(s): " + parsedBody.Language + "\n" + "Plot: " + parsedBody.Plot + "\n" +
				"Actors: " + parsedBody.Actors + "\n" + "Rotten Tomatoes Rating: " +
				parsedBody.Ratings[1].Value + "\n" + "Rotten Tomatoes URL: " + rottenTomatoesURL + "\n");
			} catch(err) {
				console.log("\n" + parsedBody.Error);
				console.log("Try entering the title of the film EXACTLY as it appears!" + "\n" + 
					"(Watch for colons, dashes, roman numerals vs. numbers, etc.)" + "\n"
				);
			};
		});
	},

	//Read in data from the "random.txt" file and re-run the liri function with the 
	//text as arguments
	doWhatItSays: function() {
		fs.readFile("./random.txt", "utf8", function(err, data) {
			if (err) {
				throw err;
			};

			var commandAndQuery = data.split(",");
			process.argv[2] = commandAndQuery[0];
			process.argv[3] = commandAndQuery[1];
			liriObject.runLiri();
		});
	},
};

liriObject.runLiri();

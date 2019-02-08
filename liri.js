require("dotenv").config();
var fs = require('fs');
var moment = require("moment");

var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var nodeArgs = process.argv;
var command = nodeArgs[2];


var artist = "";
var movie = "";
var song = "";

//For-loop to handle multiple word searches
function multipleWords() {
    for (var i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            artist = artist + "+" + nodeArgs[i];
            movie = movie + "+" + nodeArgs[i];
            song = song + "+" + nodeArgs[i];
        } else {
            artist += nodeArgs[i];
            movie += nodeArgs[i];
            song += nodeArgs[i];
        }
    };
};

//'concert-this' command using Bands in Town API
function findConcert() {
    if (command === "concert-this") {

        var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        console.log(bandsUrl);

        axios.get(bandsUrl)
            .then(function (response) {

                console.log("\nThe following event was found for " + artist + ":");
                console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
                console.log("When: " + moment(response.data[0].datetime).format('MM/DD/YYYY'));
                console.log("Venue: " + response.data[0].venue.name);
                console.log("--------------------------------\n");
            })

            .catch(function (error) {
                console.log(error);
            });
    };
};

//spotify-this-song command using Spotify API
function findSong() {
    if (command === "spotify-this-song") {

        spotify.search({
                type: 'track',
                query: song,
            })

            .then(function (response) {

                console.log("\nYour Spotify Song Search Results:");
                console.log("Artist: " + response.tracks.items[0].artists[0].name);
                console.log("Track Name: " + response.tracks.items[0].name);
                console.log("Album Name: " + response.tracks.items[0].album.name);
                console.log("Link to hear song: " + response.tracks.items[0].external_urls.spotify);
                console.log("--------------------------------\n");

            })
            .catch(function (err) {
                console.log(err);
            });
    };
};


//movie-this command using OMDB API
function findMovie() {
    if (command === "movie-this") {
        var omdbUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
        console.log(omdbUrl);

        axios.get(omdbUrl)
            .then(function (response) {
                console.log("\nYour movie search results:\n")
                console.log("Title: " + response.data.Title);
                console.log("Release Date: " + response.data.Released);
                console.log("Country of Production: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Actors/Actresses: " + response.data.Actors);
                console.log("Plot: " + response.data.Plot);
                console.log("IMDB Rating: " + response.data.imdbRating);

                if (response.data.Ratings[1].Value === false) {
                    console.log("Rotten Tomatoes Rating: N/A")
                } else {
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
                };
                console.log("----------------------------------------\n");
            })

            .catch(function (error) {
                console.log(error);
            });
    };

};

//do-what-it-says command using fs require
function doWhatItSays() {
    if (command === "do-what-it-says") {
        fs.readFile("randdom.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }

            var dataArr = data.split(",");
        });
    };
};

multipleWords();
findConcert();
findSong();
findMovie();
doWhatItSays();
require("dotenv").config();
var fs = require('fs');
var moment = require("moment");

var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);

var axios = require("axios");


//Variables for user inputs
var nodeArgs = process.argv;
var command = nodeArgs[2];

//allow for multiple word searches 
var search = "";
for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        search = search + "+" + nodeArgs[i];
    } else {
        search += nodeArgs[i];
    };
};


//switch statement function to eliminate so many if/else statements
function switchCase() {
    switch (command) {
        case "concert-this":
            findConcert(search);
            break;

        case "spotify-this-song":
            findSong(search);
            break;

        case "movie-this":
            findMovie(search);
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
        
        default:
        console.log("Sorry - Invalid Search. Please try something different...");
        break;
    };
};

//4 different functions for the different user commands

//'concert-this' command function using Bands in Town API
function findConcert(search) {

    if (search === "") {
        search = "opiuo"
    }

    var bandsUrl = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
    console.log(bandsUrl);

    axios.get(bandsUrl)
        .then(function (response) {

            console.log("\nThe following event was found for " + search + ":");
            console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
            console.log("When: " + moment(response.data[0].datetime).format('MM/DD/YYYY'));
            console.log("Venue: " + response.data[0].venue.name);
            console.log("--------------------------------\n");
        })

        .catch(function (error) {
            console.log(error);
        });

};

//spotify-this-song command function using Spotify API
function findSong(search) {

    var song;
    if (search === "") {
        song = "the sign ace of base"
    } else {
        song = search;
    }

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


//movie-this command function using OMDB API
function findMovie(search) {

    if (search === "") {
        search = "mr nobody"
    }

    var omdbUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy"
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


//do-what-it-says command function using fs require
function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        //checking outputs of dataArr variable
        console.log(dataArr);
        console.log(dataArr[0]);
        console.log(dataArr[1].slice(1, -1));

        if (dataArr[0] === "spotify-this-song") {
            var doSong = dataArr[1].slice(1, -1);
            findSong(doSong);
        } else if (dataArr[0] === "concert-this") {
            var doArtist = dataArr[1].slice(1, -1);
            findConcert(doArtist);
        } else if (dataArr[0] === "movie-this") {
            var doMovie = dataArr[1].slice(1, -1);
            findMovie(doMovie);
        }

    });
};

switchCase();
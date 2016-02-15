// express app, body-parser, request, mongoose, bcrypt, sessions, waterfall, and mongoose models
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var session = require('express-session');
var bcrypt = require('bcrypt');
var MongoStore = require('connect-mongo')(session);
var waterfall = require('async-waterfall');

// app config
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// spotify api
var spotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new spotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_SECRET,
  redirectUri: 'http://localhost:3000/index'
});
var scopes = ["playlist-read-private", "playlist-read-collaborative", "streaming", "playlist-modify-public", "playlist-modify-private", "user-follow-modify", "user-read-email", "user-library-read"];
var authorizeUrl = spotifyApi.createAuthorizeURL(scopes, null);

// mongoose database
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost:27017/spotify");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Connected to Mongo');
});

//sessions
app.use(session({
  secret: 'music',
  store: new MongoStore({url: process.env.MONGOLAB_URI || "mongodb://localhost:27017/spotify"}),
  resave: true,
  saveUninitialized: true
}));

// page route handlers
// renders login form
app.get('/', function (req, res) {
  res.render('login');
});

// renders dashboard?
app.get('/index', function (req, res) {
  if (req.query.code) {
    var code = req.query.code;
    spotifyApi.authorizationCodeGrant(code, function(err, results){
      req.session['spotify_access_token'] = results.body['access_token'];
      spotifyApi.setAccessToken(results.body['access_token']);
      spotifyApi.setRefreshToken(results.body['refresh_token']);
    });
  };
  res.render('index');
});

// renders sign up form
app.get('/users/new', function (req, res) {
  res.render('sign_up');
});

// creates user and redirects to oauth url
app.post('/users', function (req, res) {
  User.createDigestAndSave({username: req.body.username, password: req.body.password}, function(user) {
    req.session['username'] = user.username;
    req.session['userId'] = user._id;
    res.redirect(authorizeUrl);
  });
});

// logs user in, creates session, and redirects to oauth url
app.post('/login', function (req, res){
  User.authenticateUser(req.body.username, req.body.password, function(user){
    if (user) {
      req.session['username'] = user.username;
      req.session['userId'] = user._id;
      res.redirect(authorizeUrl);
    } else {
      res.redirect('/');
    };
  });
});

// logs user out
app.get('/logout', function(req, res) {
  req.session.user = false;
  req.session.userId = false;
});

// ajax route handlers
// oauth
app.get('/api/oauth', function(req, res) {
  res.json(authorizeUrl);
});

// grabs 100 new release albums
app.get('/api/newReleases', function(req, res) {
  waterfall([
    function(callback) {
      request('https://api.spotify.com/v1/search?q=tag:new&type=album&limit=50', function(err, results) {
        if (err) {
          console.log(err);
        }
        callback(null, results);
      })
    },
    function(arg1, callback) {
      request('https://api.spotify.com/v1/search?q=tag:new&type=album&limit=50&offset=50', function(err, results) {
        if (err) {
          console.log(err);
        }
        callback(null, arg1, results)
      })
    }
  ],
  function(err, arg1, arg2) {
    albums = [arg1, arg2];
    res.json(albums);
  })
});

// gets local user info
app.get('/api/getUser', function(req, res) {
  User.findOne({username: req.session['username']}, function (err, user) {
    if (err) {
      console.log(err);
    };
    res.json(user);
  });
});

// gets spotify user info
app.get('/api/getUser/spotify', function(req, res) {
  spotifyApi.getMe(function(err, data) {
    if (err) {
      console.log(err);
    };
    res.json(data);
  });
});

// get playlist info
app.post('/api/playlist', function(req, res) {
  User.findOne({username: req.session['username']}, function(err, user) {
    var playlist = user.playlists.id(req.body.playlist_name);
    res.json(playlist);
  });
});

// play tracks
app.get('/api/player/:id', function(req, res) {
  res.render('player', {id: req.params.id});
});

// creates playlist
app.post('/api/createPlaylist/:playlistName', function(req, res) {
  playlist = {playlist_name: req.params.playlistName, username: req.session.username, tracks: req.body.playlist, past: true, spotify_playlist_id: "nothing"};
  spotifyApi.getMe(function(err, data) {
    if (err) {
      console.log(err);
    };
    spotifyApi.createPlaylist(data.body.id, req.params.playlistName, function(err, results) {
      if (err) {
        console.log(err);
      };
      var trackIds = [];
      playlist.spotify_playlist_id = results.body.uri;
      User.findOne({username: req.session['username']}, function(err, user) {
        if (err) {
          console.log(err);
        };
        user.playlists.push(playlist)
        user.save(function(err, results) {
          if (err) {
            console.log(err);
          };
        });
      });
      req.body.playlist.forEach(function(track) {
        trackIds.push("spotify:track:"+track.spotify_id);
      });
      spotifyApi.addTracksToPlaylist(spotify_user_id, results.body.id, trackIds).then(function(err, data) {
        if (err) {
          console.log(err);
        };
        res.json({tracks: 'tracks added'});
      });
    });
  });
});
  

// gets album details
app.get('/api/album/:id', function(req, res) {
  spotifyApi.getAlbum(req.params.id, function(err, results) {
    if (err) {
      console.log(err);
    };
    res.json(results.body);
  });
});

// runs server
app.listen(process.env.PORT || 3000, function() {
  console.log('Connected on Port 3000');
});
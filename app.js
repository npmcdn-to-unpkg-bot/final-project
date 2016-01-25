// express app, body-parser, request, mongoose, bcrypt, sessions, and mongoose models
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var session = require('express-session');
var bcrypt = require('bcrypt');
var MongoStore = require('connect-mongo')(session)

// annas user authentication
var authenticateUser = function(name, password, callback) {
  User.findOne({username: name}, function(err, user){
    console.log(arguments);
    if (err) {
      console.log(err);
    }
    if (user) {
      bcrypt.compare(password, user.password_digest, function (err, results) {
        if (results) {
          callback(user);
        } else {
          callback(false);
        }
      })
    }
  });
};

// app config
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// spotify api
var spotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new spotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_SECRET,
  redirectUri: 'https://blooming-stream-74013.herokuapp.com/index'
});
var scopes = ["playlist-read-private", "playlist-read-collaborative", "streaming", "playlist-modify-public", "playlist-modify-private", "user-follow-modify", "user-read-email", "user-library-read"];
var authorizeUrl = spotifyApi.createAuthorizeURL(scopes, null);

// mongoose database
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost:27017/spotify");
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function() {
  console.log('connect4')
})

app.use(session({
  secret: 'music',
  store: new MongoStore({url: process.env.MONGOLAB_URI || "mongodb://localhost:27017/spotify"}),
  resave: true,
  saveUninitialized: true
}))

// page route handlers
app.get('/', function (req, res) {
  res.render('login');
});
// renders dashboard?
app.get('/index', function (req, res) {
  if (req.query.code) {
    var code = req.query.code;
    spotifyApi.authorizationCodeGrant(code, function(err, results){
      req.session['spotify_access_token'] = results.body['access_token']
      spotifyApi.setAccessToken(results.body['access_token']);
      spotifyApi.setRefreshToken(results.body['refresh_token']);
    })
  }
  res.render('index')
})
// renders sign up form
app.get('/users/new', function (req, res) {
  res.render('sign_up')
})
// creates user and redirects to login
app.post('/users', function (req, res) {
  User.createDigestAndSave({username: req.body.username, password: req.body.password}, function(user) {
    req.session['username'] = user.username;
    req.session['userId'] = user._id;
    res.redirect('/index');
  })
})
// logs user in, creates session, and redirects to /login
app.post('/login', function (req, res){
  authenticateUser(req.body.username, req.body.password, function(user){
    if (user) {
      req.session['username'] = user.username
      req.session['userId'] = user._id;
      res.redirect(authorizeUrl);
    } else {
      res.redirect('/');
    }
  });
})

// logs user out
app.get('/logout', function(req, res) {
  req.session.user = false;
  req.session.userId = false;
})
// ajax route handlers
// oauth
app.get('/api/oauth', function(req, res) {
  res.json(authorizeUrl);
});
// grabs 1st 20 new releases
app.get('/api/newReleases', function(req, res) {
  request('https://api.spotify.com/v1/search?q=tag:new&type=album', function(err, results) {
    if (err) {
      console.log(err);
    }
    res.json(results.body);
  })
})
// grabs 2nd 20 new releases
app.get('/api/newReleasesTwo', function(req, res) {
  request('https://api.spotify.com/v1/search?q=tag:new&type=album&offset=20', function(err, results) {
    if (err) {
      console.log(err);
    }
    res.json(results.body);
  })
})
// gets user info
app.get('/api/getUser', function(req, res) {
  User.findOne({username: req.session['username']}, function (err, user) {
    if (err) {
      console.log(err);
    }
    res.json(user);
  })
})

// gets spotify user info
app.get('/api/getUser/spotify', function(req, res) {
  spotifyApi.getMe(function(err, data) {
    if (err) {
      console.log(err)
    }
    res.json(data);
  })
})

// get playlist info
app.post('/api/playlist', function(req, res) {
  User.findOne({username: req.session['username']}, function(err, user) {
    var playlist = user.playlists.id(req.body.playlist_name)
    console.log(playlist)
    res.json(playlist)
  })
})

// play tracks
app.get('/api/player/:id', function(req, res) {
  res.render('player', {id: req.params.id})
})

// creates playlist
app.post('/api/createPlaylist/:playlistName', function(req, res) {
  playlist = {playlist_name: req.params.playlistName, username: req.session.username, tracks: req.body.playlist, past: true, spotify_playlist_id: "nothing"};
  spotifyApi.getMe(function(err, data) {
    if (err) {
      console.log(err)
    }
    spotifyApi.setAccessToken(spotifyApi.getAccessToken());
    var spotify_user_id = data.body.id;
  
    spotifyApi.createPlaylist(data.body.id, req.params.playlistName, function(err, results) {
      if (err) {
        console.log(err)
      }
      console.log(results.body)
      var trackIds = [];
      playlist.spotify_playlist_id = results.body.uri
      User.findOne({username: req.session['username']}, function(err, user) {
        if (err) {
          console.log(err)
        }
        user.playlists.push(playlist)
        user.save(function(err, results) {
          if (err) {
            console.log(err);
          }
          console.log('saved')
        })
      })
      req.body.playlist.forEach(function(track) {
        trackIds.push("spotify:track:"+track.spotify_id);
      });
      console.log(playlist)
      spotifyApi.addTracksToPlaylist(spotify_user_id, results.body.id, trackIds).then(function(err, data) {
        if (err) {
          console.log(err)
        }
        res.json({tracks: 'tracks added'});
      })
    });
  })
})
  

// gets more info on album
app.get('/api/album/:id', function(req, res) {
  spotifyApi.getAlbum(req.params.id, function(err, results) {
    if (err) {
      console.log(err);
    }
    res.json(results.body);
  })
})

// run server
app.listen(process.env.PORT || 3000, function() {
  console.log('yaaaaaaaas');
})
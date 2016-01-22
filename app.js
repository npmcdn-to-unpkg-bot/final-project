// express app
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Playlist = require('./models/playlist.js');
var session = require('express-session');
var bcrypt = require('bcrypt');

// annas user authentication
var authenticateUser = function(name, password, callback) {
  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    bcrypt.compare(password, user.password_digest, function (err, results) {
      if (results) {
        callback(data);
      } else {
        callback(false);
      }
    })
  })
}

// app config
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'music'
}))

// spotify api
var spotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new spotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_SECRET,
  redirectUri: "http://127.0.0.1:3000"
});
var scopes = ["playlist-read-private", "playlist-read-collaborative", "streaming", "playlist-modify-public", "playlist-modify-private", "user-follow-modify", "user-read-email"];
var authorizeUrl = spotifyApi.createAuthorizeURL(scopes);

// mongoose database
mongoose.connect("mongodb://localhost:27017/spotify");
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function() {
  console.log('connect4')
})

// page route handlers
app.get('/', function(req, res) {
  if (req.query.code) {
    var code = req.query.code;
    spotifyApi.authorizationCodeGrant(code, function(err, results){
      spotifyApi.setAccessToken(results.body['access_token']);
      spotifyApi.setRefreshToken(results.body['refresh_token']);
    })
  }
  res.render('index');
});

// ajax route handlers
app.get('/api/oauth', function(req, res) {
  res.json(authorizeUrl);
});

app.get('/api/newReleases', function(req, res) {
  request('https://api.spotify.com/v1/search?q=tag:new&type=album', function(err, results) {
    if (err) {
      console.log(err);
    }
    res.json(results.body);
  })
})

app.get('/api/newReleasesTwo', function(req, res) {
  request('https://api.spotify.com/v1/search?q=tag:new&type=album&offset=20', function(err, results) {
    if (err) {
      console.log(err);
    }
    res.json(results.body);
  })
})

app.get('/api/createUser', function(req, res) {
  user = new User({username: req.body.username});
  bcrypt.hash(req.body.password, 8, function(err, hash) {
    user.password_digest = hash
    user.save(function (err) {
      if (err) {
        console.log(err)
      }
      console.log('created user');
      res.end();
    })
  })
})

app.get('/api/createAlex', function (req, res) {
  user = new User({username: 'Scho'});
  bcrypt.hash('password', 8, function(err, hash) {
    user.password_digest = hash
    user.save(function (err) {
      if (err) {
        console.log(err)
      }
      console.log('created user');
      res.end();
    })
  })
})

app.post('/login', function(req, res){
  authenticateUser(req.body.username, req.body.password, function (user){
    if (user) {
      req.session.name = user.name
      res.json('success');
    } else {
      res.json('failure');
    }
  });
})

app.get('/api/createPlaylist', function(req, res) {
  playlist = Playlist({name: "AwesomenessTwo", username: "Jeff"});
  playlist.save(function(err) {
    if (err) {
      console.log(err);
    }
    console.log('created playlist')
    res.end();
  })
});

app.get('/api/album/:id', function(req, res) {
  spotifyApi.getAlbum(req.params.id, function(err, results) {
    if (err) {
      console.log(err);
    }
    res.json(results.body);
  })
})

// run server
app.listen(3000, function() {
  console.log('yaaaaaaaas');
})
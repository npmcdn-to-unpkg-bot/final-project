var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var songSchema = mongoose.Schema({
  spotify_id: String,
  track_name: String,
  track_artist: String
})

var playlistSchema = mongoose.Schema({
  playlist_name: String,
  user_name: String,
  tracks: [songSchema],
  past: Boolean,
  spotify_playlist_id: String
});

var userSchema = mongoose.Schema({
  username: String,
  password_digest: String,
  playlists: [playlistSchema]
})
userSchema.pre('save', function (next) {
  console.log('saving', this)
  next();
})

userSchema.pre('create', function(next) {
  console.log('creating', this);
  next();
})

userSchema.statics.createDigestAndSave = function(user, callback) {
  console.log(user);
  var User = this;
  bcrypt.hash(user.password, 8, function(err, hash) {
    user.password_digest = hash
    delete user.password
    var newUser = new User(user);
    newUser.save(callback(newUser));
  })
}

userSchema.statics.authenticateUser = function(name, password, callback) {
  var User = this;
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

module.exports = mongoose.model('User', userSchema);
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

module.exports = mongoose.model('User', userSchema);
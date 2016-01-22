var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
  name: String,
  spotifyId: Number
})

var playlistSchema = mongoose.Schema({
  name: String,
  content: [songSchema],
  userName: String
});

module.exports = mongoose.model('Playlists', playlistSchema);
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password_digest: String
})

module.exports = mongoose.model('User', userSchema);
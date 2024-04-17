const mongoose = require('mongoose');

// Define schema for user model
const userSchema1 = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  followedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Define and export the User model
module.exports = mongoose.model('User1', userSchema1);

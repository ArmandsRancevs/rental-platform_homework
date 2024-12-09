// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  role: String, // 'admin' vai 'user'
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: String,
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    lastVisit: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
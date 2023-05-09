const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  category1: { type: Number, required: true },
  category2: { type: Number, required: true },
  category3: { type: Number, required: true },
});

module.exports = mongoose.model('User', UserSchema);
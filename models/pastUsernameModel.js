const mongoose = require('mongoose');

const pastUserNameSchema = new mongoose.Schema({
  userNames: {
    type: [Object],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const pastUserNameModel = mongoose.model('pastUserNames', pastUserNameSchema);
module.exports = pastUserNameModel;

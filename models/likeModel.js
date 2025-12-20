const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const likeModel = mongoose.model('Like', likeSchema);
module.exports = likeModel;

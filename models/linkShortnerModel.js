const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  code: String,
  refLink: String,
  viewCount: { type: Number, default: 0 },
});

const linkModel = mongoose.model('shortenLink', linkSchema);
module.exports = linkModel;

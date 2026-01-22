const mongoose = require('mongoose');
const ogImagesSchema = new mongoose.Schema({
  links: Array,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const ogImagesModel = mongoose.model('ogImagesModel', ogImagesSchema);
module.exports = ogImagesModel;

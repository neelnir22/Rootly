const mongoose = require('mongoose');
const ogImagesSchema = new mongoose.Schema({
  parsedHtmlDescription: String,

  parsedHtmlTitle: String,

  parsedHtmlKeyword: String,

  parsedHtmlLink: String,

  parsedHtmlImage: String,
});

const ogImagesModel = mongoose.model('ogImagesModel', ogImagesSchema);
module.exports = ogImagesModel;

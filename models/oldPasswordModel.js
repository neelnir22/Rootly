const mongoose = require('mongoose');
const passwordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  oldpasswords: [String],
});

const oldPassword = mongoose.model('oldPassword', passwordSchema);
module.exports = oldPassword;

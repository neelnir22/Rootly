const mongoose = require('mongoose');
const argon = require('argon2');
const validator = require('validator');
const emailSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: [
      true,
      'A user must have a otp when he/she wants to verify thier email',
    ],
    max: 6,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
  },
  createdAt: Number,
  lastedTill: Number,
});

// emailSchema.pre('save', async function (next) {
//   this.otp = await argon.hash(this.otp);
// });

// emailSchema.methods.verifyOtp = async function (userOtp, otp) {
//   return userOtp === otp;
// };
emailSchema.methods.isWithinTime = function (otpTime, validTill) {
  console.log(validTill, otpTime);
  return validTill > otpTime;
};
const Email = mongoose.model('Email', emailSchema);
module.exports = Email;

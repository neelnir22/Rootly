const otpGenerator = require('otp-generator');
const sendEmail = require('../utils/email');
const Email = require('../models/emailModel');

const emailVerify = async (options) => {
  let otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const mailSended = await sendEmail({
    email: options.email,
    subject: options.subject,
    text: options.text,
    otp: otp,
  });
  const emailDb = await Email.create({
    userId: options.userId,
    otp: otp,
    email: options.email,
    createdAt: Date.now(),
    lastedTill: Date.now() + 600000,
  });
};
module.exports = emailVerify;

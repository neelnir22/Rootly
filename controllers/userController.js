const User = require('../models/userModel');
const emailVerify = require('../utils/emailVerify');
const Email = require('../models/emailModel');
const createJwtToken = require('../utils/createJwtToken');

const jwtToken = require('jsonwebtoken');
const validator = require('email-validator');
const argon = require('argon2');

exports.getUserByUsername = async (req, res, next) => {
  try {
    const userName = req.params.userName.split('=')[1];

    if (!userName) {
      throw new Error('please provide a username');
    }
    const user = await User.findOne({ userName });

    if (!user || !user.active) {
      throw new Error('no such user find with the username provided');
    }

    user.password = undefined;
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const payload = req.payload;

    const user = await User.deleteOne({ _id: payload.id });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.verifyMyEmail = async (req, res) => {
  try {
    const payload = req.payload;

    emailVerify({
      email: payload.email,
      subject: 'Email Verification',
      text: `Verify your email by using this otp`,
      userId: payload.id,
    });
    res.status(200).json({
      status: 'success',
      message: 'verification otp has been sent',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.accountDeactive = async (req, res) => {
  try {
    const payload = req.payload;

    const user = await User.findOne({ _id: payload.id });

    user.active = false;

    user.disableTill = Date.now() + 2592000000;

    const token = createJwtToken(user);

    await user.save();

    res.status(200).json({
      status: 'success',
      token,
      message:
        'account has been disabled,login before 1 month to prevent permanent deletion',
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

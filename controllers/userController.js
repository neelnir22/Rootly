const emailVerify = require('../utils/emailVerify');
const createJwtToken = require('../utils/createJwtToken');

const User = require('../models/userModel');
const Email = require('../models/emailModel');
const pastUsernameModel = require('../models/pastUsernameModel');
const likeModel = require('../models/likeModel');
const linkShortnerModel = require('../models/linkShortnerModel');
const ogImagesModel = require('../models/ogImagesModel');
const oldPasswordModel = require('../models/oldPasswordModel');

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
    // finding user cause we have to find user to delete everything related to him
    const user = await User.findOne({ _id: payload.id });

    // deleting user
    await User.deleteOne({ _id: payload.id });
    // deleting ogImage of user
    await ogImagesModel.deleteOne({ _id: user.links });
    // deleting shortenLink of user
    await linkShortnerModel.deleteOne({ user: user._id });
    // deleting likeModel of user
    await likeModel.deleteOne({ from: user._id });
    // deleting pastUsername of user
    await pastUsernameModel.deleteOne({ user: user._id });
    // deleting oldPasswordModel of user
    await oldPasswordModel.deleteOne({ user: user._id });
    // deleting pastUserNameModel of user
    await pastUsernameModel.deleteOne({ user: user._id });

    res.status(200).json({
      status: 'success',
    });
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

exports.viewPastUserName = async (req, res, next) => {
  try {
    const payload = req.payload;
    const pastUserNames = await UserName.findOne({ user: payload.id });
    const userNames = pastUserNames.userNames;
    res.status(200).json({
      status: 'success',
      results: userNames,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.seeOwnProfile = async (req, res) => {
  try {
    const payload = req.payload;
    const user = await User.findOne({ _id: payload.id }).populate('links');
    user.password = undefined;
    user.emailVerified = undefined;
    user.phoneNumVerified = undefined;
    user.active = undefined;
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.downloadUserData = async (req, res) => {
  try {
    const payload = req.payload;

    const user = await User.findOne({ _id: payload.id }).populate('links');

    const linkShort = await linkShortnerModel.findOne({ user: user._id });

    const likes = await likeModel.find({ from: user._id });

    const pastUserName = await pastUsernameModel.findOne({ user: user._id });

    // headers to be set to give instructions to the browser
    res.setHeader('Content-Disposition', 'attachment; filename="data.json"');

    res.setHeader('Content-Type', 'application/json');

    let userData = JSON.stringify(
      {
        ...user,
        ...linkShort,
        ...likes,
        ...pastUserName.userNames,
      },
      null,
      2,
    );

    res.send(userData);
  } catch (err) {
    res.status(200).json({
      status: 'fail',
      message: err.message,
    });
  }
};

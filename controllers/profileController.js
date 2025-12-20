const User = require('../models/userModel');
const Email = require('../models/emailModel');
const Like = require('../models/likeModel');
const emailVerify = require('../utils/emailVerify');
const createJwtToken = require('../utils/createJwtToken');

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const validator = require('email-validator');

exports.updateUserName = async (req, res, next) => {
  try {
    const payload = req.payload;

    if (!req.body.userName) {
      throw new Error('Provide a UserName');
    }

    const totalUserName = await User.find({ userName: req.body.userName });

    // console.log(totalUserName);

    if (totalUserName.length > 0) {
      throw new Error('userName has already been existed');
    }

    const user = await User.findOne({ _id: payload.id });

    user.userName = req.body.userName;

    await user.save();
    return res.status(200).json({
      status: 'success',
      message: `data has been updated.`,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateName = async (req, res) => {
  try {
    const payload = req.payload;

    if (!req.body.lastName || !req.body.firstName) {
      throw new Error('Name not found');
    }

    const user = await User.findOne({ _id: payload.id });

    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }

    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }

    await user.save();
    res.status(200).json({
      status: 'success',
      message: 'Name has updated',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const payload = req.payload;

    if (!req.body.email) {
      throw new Error('email not found');
    }
    if (!validator.validate(email)) {
      throw new Error('please provide an valid email');
    }

    const totalEmails = await User.find({ email: req.body.email });

    if (totalEmails.length > 0) {
      throw new Error('Email existed');
    }

    const user = await User.findOne({ _id: payload.id });

    emailVerify({
      email: req.body.email,
      subject: 'Email Verification',
      text: `Verify your email by using this otp`,
      userId: user._id,
    });

    user.email = req.body.email;
    user.emailVerified = false;

    await user.save();

    const token = createJwtToken(user);

    res.status(200).json({
      status: 'success',
      token,
      message: 'email has been successfully changed, please verify it again',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateLogo = async (req, res, next) => {
  try {
    const payload = req.payload;

    if (!req.body.logo) {
      throw new Error('logo not found');
    }

    const user = await User.findOne({ _id: payload.id });

    user.logo = req.body.logo;

    await user.save();
    res.status(200).json({
      status: 'success',
      message: 'logo has been updated',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateExternalLink = async (req, res, next) => {
  try {
    const payload = req.payload;
    const { instagram, twitter, linkedin, gmail, tiktok, snapChat, links } =
      req.body;

    const user = await User.findOne({ _id: payload.id });

    if (instagram) user.instagram = req.body.instagram;
    if (twitter) user.twitter = req.body.twitter;
    if (linkedin) user.linkedin = req.body.linkedin;
    if (gmail) user.gmail = req.body.gmail;
    if (tiktok) user.tiktok = req.body.tiktok;
    if (snapChat) user.snapChat = req.body.snapChat;
    if (links) user.links.push(links);

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'updated successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateLikeCount = async (req, res, next) => {
  try {
    const payload = req.payload;
    // console.log(payload);

    // console.log(user);
    const toUsername = req.body.to;

    if (!toUsername) {
      throw new Error('please provide to and from ref');
    }

    const toUser = await User.findOne({ userName: toUsername });

    if (!toUser) {
      throw new Error('username not exist');
    }

    const user = await User.findOne({ _id: payload.id });

    const likeAllId = await Like.find({ from: user._id });

    if (likeAllId.length === 0) {
      toUser.likeCount += 1;

      res.status(200).json({
        status: 'success',
        message: `${user.userName} liked ${toUser.userName}'s profile`,
      });

      await Like.create({
        to: toUser._id,
        from: user._id,
      });
    }
    if (likeAllId.length === 1) {
      toUser.likeCount -= 1;

      await Like.deleteOne({ from: user._id });

      res.status(200).json({
        status: 'success',
        message: `${user.userName} disliked ${toUser.userName}'s profile`,
      });
    }

    await toUser.save();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteLink = async (req, res, next) => {
  try {
    const payload = req.payload;
    if (!req.body) {
      throw new Error('provide a link to delete');
    }

    const { instagram, linkedin, twitter, gmail, tiktok, snapChat, links } =
      req.body;

    const user = await User.findOne({ _id: payload.id });

    if (user.instagram || instagram) {
      await User.updateOne({ _id: payload.id }, { $unset: { instagram: ' ' } });
    }

    if (user.linkedin || linkedin) {
      await User.updateOne({ _id: payload.id }, { $unset: { linkedin: ' ' } });
    }

    if (user.twitter || twitter) {
      await User.updateOne({ _id: payload.id }, { $unset: { twitter: ' ' } });
    }

    if (user.gmail || gmail) {
      await User.updateOne({ _id: payload.id }, { $unset: { gmail: ' ' } });
    }

    if (user.tiktok || tiktok) {
      await User.updateOne({ _id: payload.id }, { $unset: { tiktok: ' ' } });
    }

    if (user.snapChat || snapChat) {
      await User.updateOne({ _id: payload.id }, { $unset: { snapChat: ' ' } });
    }

    if (user.links || links) {
      console.log({ 0: req.body.links - 1, 1: req.body.links });
      user.links.splice(req.body.links, 1);
      await user.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'deleted successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

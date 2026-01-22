const User = require('../models/userModel');
const Email = require('../models/emailModel');
const Like = require('../models/likeModel');
const emailVerify = require('../utils/emailVerify');
const createJwtToken = require('../utils/createJwtToken');
const UserName = require('../models/pastUsernameModel');
const generateOgImages = require('../utils/generateOgImages');
const ogImagesModel = require('../models/ogImagesModel');

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const validator = require('email-validator');
const dayjs = require('dayjs');
const ogImages = require('../utils/generateOgImages');

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

    const userName = await UserName.findOne({ user: payload.id });

    userName.userNames.unshift({
      username: req.body.userName,
      createdAtDate: dayjs().format('DD-MM-YYYY'),
      createdAtTime: dayjs().format('HH:mm:ss A'),
    });

    user.userName = req.body.userName;

    await userName.save();
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
    const { links } = req.body;

    const user = await User.findOne({ _id: payload.id });

    const ogImageDetails = await generateOgImages(links, links, user._id);

    const ogImage = await ogImagesModel.findOne({ _id: user.links });

    if (ogImage) {
      ogImage.links.push(ogImageDetails);

      await ogImage.save();
    }
    if (!ogImage) {
      const ogImageDetails = await ogImages(links);
      const newOgImage = await ogImagesModel.create({
        links: ogImageDetails,
      });
      user.links = newOgImage._id;
      await user.save();
    }

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

    const { links } = req.body;

    const user = await User.findOne({ _id: payload.id });
    const ogImage = await ogImagesModel.findOne({ _id: user.links });

    if (!ogImage) {
      throw new Error('No OgImage found ');
    }

    if (ogImage.links || links) {
      ogImagesModel.links.forEach((element) => {
        console.log(element);
        if ((element.url = links)) {
          const index = ogImage.links.indexOf(element);
          ogImage.links.splice(index, 1);
        } else {
          throw new Error('link not found');
        }
      });
      ogImage.save();
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

const validator = require('email-validator');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const argon = require('argon2');

const emailVerify = require('../utils/emailVerify');
const User = require('../models/userModel');
const Email = require('../models/emailModel');
const createJwtToken = require('../utils/createJwtToken');
const UserName = require('../models/pastUsernameModel');
const oldPassword = require('../models/oldPasswordModel');

// const { oldPassword } = require('./userController');

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      userName: req.body.userName,
      password: req.body.password,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      linkedin: req.body.linkedin,
      gmail: req.body.gmail,
      youTube: req.body.youTube,
      tiktok: req.body.tiktok,
      snapChat: req.body.snapChat,
    });
    const token = createJwtToken(newUser);
    // adding user username to database
    await UserName.create({
      userNames: {
        username: req.body.userName,
        createdAtDate: dayjs().format('DD-MM-YYYY'),
        createdAtTime: dayjs().format('HH:mm:ss A'),
      },
      user: newUser._id,
    });

    await oldPassword.create({
      user: newUser._id,
      oldpasswords: await argon.hash(req.body.password),
      createdAt: dayjs().format('DD-MM-YYYY-HH:mm:ss A'),
    });
    emailVerify({
      email: req.body.email,
      subject: 'Email Verification',
      text: `Verify your email by using this otp`,
      userId: newUser._id,
    });
    newUser.password = undefined;
    res.status(200).json({
      status: 'success',
      token,
      message: `welcome to our family ${
        newUser.firstName + newUser.lastName
      }, Please check your mail for Email Verification`,
      newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('please provide email and password');
    }
    if (!validator.validate(email)) {
      throw new Error('please provide an valid email');
    }
    if (password.length < 8) {
      throw new Error('password should be greater than or equals to 8 letters');
    }

    const user = await User.findOne({ email }).select('+password');

    // console.log(user);

    if (!user || !(await user.comparePassword(user.password, password))) {
      throw new Error('provided credentials are incorrect');
    }

    if (!user.active) {
      user.active = true;
      user.disableTill = null;
      await user.save();
    }
    user.password = undefined;
    const token = createJwtToken(user);

    res.status(200).json({
      status: 'Success',
      token,
      message: `Welcome Back ${
        user.firstName + user.lastName
      }, Good to See You`,
      user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      throw new Error('Please provide a email');
    }
    if (!validator.validate(email)) {
      throw new Error('please provide an valid email');
    }
    // find user assosiated to the given email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(
        'there is no such user related to the email you have provided'
      );
    }

    emailVerify({
      email,
      subject: 'Forgot Password',
      text: 'Change your Password by using this otp',
      userId: user._id,
      email: email,
    });

    res.status(200).json({
      status: 'success',
      message:
        'A otp has been sent to the email you provided, use that otp to change password',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.changePasswordAfterForgot = async (req, res, next) => {
  try {
    const { otp, newPassword } = req.body;
    // console.log({ otp, password });
    if (otp.length < 6 || !(typeof otp === 'string')) {
      throw new Error('provide correct otp');
    }

    if (newPassword.length < 8) {
      throw new Error('password should be greater than or equals to 8 letters');
    }

    const otpDetails = await Email.findOne({ otp });

    if (!otpDetails) {
      throw new Error('invalid otp');
    }

    if (Date.now() > otpDetails.lastedTill) {
      throw new Error('otp has been expired , go get new one');
    }
    const user = await User.findOne({ email: otpDetails.email });

    const userOldPassword = await oldPassword.findOne({
      user: otpDetails.userId,
    });

    for (let i = 0; i < userOldPassword.oldpasswords.length; i++) {
      if (await argon.verify(userOldPassword.oldpasswords[i], newPassword)) {
        throw new Error('you cant set previous passwords');
      }
    }

    userOldPassword.oldpasswords.push(await argon.hash(password));

    await userOldPassword.save();

    user.password = password;

    await user.save();
    res.status(200).json({
      status: 'success',
      message: 'password has been updated successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const payload = req.payload;
    // console.log(validatedUser.email);
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new Error('Please provide currentPassword,newPassword');
    }

    if (currentPassword === newPassword) {
      throw new Error('you cant set new one same as old one');
    }

    if (newPassword.length < 8 || currentPassword.length < 8) {
      throw new Error('password should be greater than or equals to 8 letters');
    }

    const user = await User.findOne({ _id: payload.id }).select(
      '+currentPassword'
    );
    if (
      !user ||
      !(await user.comparePassword(user.password, currentPassword))
    ) {
      throw new Error('either email or currentPassword is incorrect');
    }

    const userOldPassword = await oldPassword.findOne({
      user: payload.id,
    });

    for (let i = 0; i < userOldPassword.oldpasswords.length; i++) {
      if (await argon.verify(userOldPassword.oldpasswords[i], newPassword)) {
        throw new Error('you cant set previous passwords');
      }
    }

    userOldPassword.oldpasswords.push(await argon.hash(newPassword));

    await userOldPassword.save();

    user.password = newPassword;

    await user.save();
    res.status(200).json({
      status: 'success',
      message: 'Your password has been updated sucessfully.',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.emailVerifyUpdate = async (req, res, next) => {
  try {
    const otp = req.body.otp;
    if (!otp) {
      throw new Error(
        'there is no otp! please provide an otp for email verification'
      );
    }

    if (!(typeof otp === 'string')) {
      throw new Error('Please provide correct otp!!');
    }
    const verifyEmail = await Email.findOne({ otp });
    if (!verifyEmail) {
      throw new Error('invalid otp');
    }

    if (Date.now() > verifyEmail.lastedTill) {
      throw new Error('otp has been expired, go get new one');
    }

    const user = await User.findOne({ email: verifyEmail.email });
    if (otp === verifyEmail.otp) {
      user.emailVerified = true;
    } else {
      throw new Error(
        'Otp is invalid,Please write the correct otp for verification'
      );
    }
    await user.save();
    // Xr0LKEM0
    const token = createJwtToken(user);

    res.status(200).json({
      status: 'success',
      token,
      message: `Email has verified`,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  // check whether the user logged in or not before giving them permissions like resetPassword or change username/logo/name etc
  // 1 checks tokens using jwt.verify with secret message
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      throw new Error('error in logging you in');
    }

    // verify the token
    const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: payload.id });

    if (!user || !payload.active) {
      throw new Error('User not found,try again');
    }

    // console.log(payload);
    req.payload = payload;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.checkUserVerified = (req, res, next) => {
  try {
    if (!req.payload.emailVerified) {
      throw new Error('User have to verified first to access');
    }
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const mongoose = require('mongoose');
// const { act } = require("react");
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const argon = require('argon2');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'User Must have a firstName'],
    maxlength: 12,
    minlength: 1,
    validate: {
      validator: validator.isAlpha,
      message: 'Enter a valid Name',
    },
  },
  lastName: {
    type: String,
    maxlength: 20,
    minlength: 1,
    validate: {
      validator: validator.isAlpha,
      message: 'Enter a valid Name',
    },
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: 'please enter a valid email address',
    },
    unique: true,
  },
  phoneNum: {
    type: Number,
    maxlength: 10,
    minlength: 10,
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
  },
  userName: {
    type: String,
    required: [true, 'User Must provide a username'],
    unique: true,
  },
  instagram: {
    type: String,
  },
  twitter: String,
  linkedin: String,
  gmail: String,
  youTube: String,
  tiktok: String,
  snapChat: String,
  links: {
    type: [String],
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  logo: {
    type: String,
    default: '../public/img/blankuser',
  },
  phoneNumVerified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  disableTill: Number,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;

  this.password = await argon.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (userPassword, password) {
  return await argon.verify(userPassword, password);
};

const User = mongoose.model('Users', userSchema);
module.exports = User;

const User = require('../models/userModel');
const Email = require('../models/emailModel');
const Like = require('../models/likeModel');
const UserName = require('../models/pastUsernameModel');
const linkShortner = require('../models/linkShortnerModel');

const linkCheck = require('link-check');
const randomString = require('random-string-generator');

exports.linkShortner = async (req, res) => {
  try {
    if (!req.body.link) {
      throw new Error('only link can shorten here');
    }

    linkCheck(
      req.body.link,
      { headers: { Authorization: 'Basic Zm9vOmJhcg==' } },
      function (err, result) {
        if (err) {
          throw new Error('Invalid Link');
        }
      }
    );

    const shortenLinkCode = randomString(7, 'upper');

    await linkShortner.create({
      user: req.payload.id,
      refLink: req.body.link,
      code: shortenLinkCode,
      shortLink: `root.ly/${shortenLinkCode}`,
    });

    res.status(200).json({
      status: 'success',
      message: 'successfully shorten the given link',
      result: `root.ly/${shortenLinkCode}`,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateLinkShortner = async (req, res) => {
  try {
    const { shortenLink, updatedCode, link } = req.body;

    if (!shortenLink) {
      throw new Error('you cant change this here');
    }
    if (!shortenLink.includes('root.ly/')) {
      throw new Error('invalid link');
    }

    const shortenLinkCode = shortenLink.split('/')[1];

    if (!shortenLinkCode) {
      throw new Error('invalid link');
    }
    const shortLink = await linkShortner.findOne({ code: shortenLinkCode });

    if (!shortLink) {
      throw new Error('invalid link, cant be found inside our servers');
    }
    // root.ly/VVIUZJA
    if (link) {
      linkCheck(
        req.body.link,
        { headers: { Authorization: 'Basic Zm9vOmJhcg==' } },
        function (err, result) {
          if (err) {
            throw new Error('Invalid Link');
          }
        }
      );
      shortLink.refLink = link;
    }

    if (updatedCode) {
      const shortLinkCodes = await linkShortner.find({ code: updatedCode });

      if (updatedCode.length > 7 || shortLinkCodes.length > 0) {
        throw new Error('you cant use this code, please use another');
      }

      shortLink.code = updatedCode;
      shortLink.shortLink = `root.ly/${updatedCode}`;
    }

    await shortLink.save();

    res.status(200).json({
      status: 'success',
      message: 'link updated succesfully',
      result: {
        shortLink: `${shortLink.shortLink}`,
        refLink: shortLink.refLink,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getShortLink = async (req, res) => {
  try {
    const payload = req.payload;
    const shortLinks = await linkShortner.find({ user: payload.id });
    if (shortLinks.length === 0) {
      throw new Error('No short link has been founded, go create one');
    }
    res.status(200).json({
      status: 'success',
      result: shortLinks,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteShortLink = async (req, res) => {
  try {
    const payload = req.payload;

    const { shortLink } = req.body;

    const shortenLinkCode = shortLink.split('/')[1];

    const shortLinks = await linkShortner.findOne({ code: shortenLinkCode });

    if (!shortLinks) {
      throw new Error('link cant be found on our server');
    }

    await linkShortner.deleteOne({
      user: payload.id,
      code: shortenLinkCode,
    });

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

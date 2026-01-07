const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const linkController = require('../controllers/linkController');
const router = express.Router();

router
  .route('/Like')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    profileController.updateLikeCount
  );

router
  .route('/userName')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    profileController.updateUserName
  );
router
  .route('/Name')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    profileController.updateName
  );
router
  .route('/email')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    profileController.updateEmail
  );
router
  .route('/logo')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    profileController.updateLogo
  );
router
  .route('/add-Links')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    profileController.updateExternalLink
  );
router
  .route('/delete-link')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    profileController.deleteLink
  );

router
  .route('/short-link')
  .post(
    authController.protect,
    authController.checkUserVerified,
    linkController.linkShortner
  );
router
  .route('/update-short-link')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    linkController.updateLinkShortner
  );
router
  .route('/get-short-links')
  .get(
    authController.protect,
    authController.checkUserVerified,
    linkController.getShortLinks
  );
router
  .route('/view-short-link/:shortLinkCode')
  .get(
    authController.protect,
    authController.checkUserVerified,
    linkController.viewSingleShortLink
  );

module.exports = router;

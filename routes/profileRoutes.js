const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
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

module.exports = router;

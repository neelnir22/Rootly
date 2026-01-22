const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/email-verify').post(authController.emailVerifyUpdate);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/get-user/:userName').get(userController.getUserByUsername);

router
  .route('/update-Like-Count')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    profileController.updateLikeCount,
  );
router
  .route('/forgot-password-change')
  .patch(authController.changePasswordAfterForgot);
router
  .route('/reset-password')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    authController.resetPassword,
  );
router
  .route('/delete-user')
  .delete(
    authController.protect,
    authController.checkUserVerified,
    userController.deleteUser,
  );
router
  .route('/deactive-user')
  .patch(
    authController.protect,
    authController.checkUserVerified,
    userController.accountDeactive,
  );
router
  .route('/view-past-usernames')
  .get(
    authController.protect,
    authController.checkUserVerified,
    userController.viewPastUserName,
  );

router
  .route('/verify-my-email')
  .post(authController.protect, userController.verifyMyEmail);

router
  .route('/view-profile')
  .get(authController.protect, userController.seeOwnProfile);

module.exports = router;

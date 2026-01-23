const jwt = require('jsonwebtoken');
const emailVerify = require('./emailVerify');

const createJwtToken = function (user) {
  const payload = {
    id: user._id,
    email: user.email,
    emailVerified: user.emailVerified,
    active: user.active,
  };
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIN = process.env.JWT_EXPIRES_IN;
  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIN });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    ),
    secure: true,
    httpOnly: true,
  };
  return [token, cookieOptions];
};
module.exports = createJwtToken;

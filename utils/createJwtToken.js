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
  return token;
};
module.exports = createJwtToken;

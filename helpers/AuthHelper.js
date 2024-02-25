const jwt = require('jsonwebtoken');
const { secret } = require('../config');

class AuthHelper {
  simpleAuthorize(token) {
    return jwt.verify(token, secret);
  }
}

module.exports = new AuthHelper();

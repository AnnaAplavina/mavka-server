const User = require('./../data-access/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('./../config.js');

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, secret, { expiresIn: '1w' });
};

class AuthService {
  async registration(user) {
    try {
      const hashPass = bcrypt.hashSync(user.pass, 7);
      await User.addUser(
        user.email,
        user.username,
        hashPass,
        user.first_name,
        user.last_name
      );
    } catch (exc) {
      if (exc.constraint == 'users_email_key') {
        throw new Error('The email is already used');
      } else if (exc.constraint == 'users_username_key') {
        throw new Error('The username is already used');
      } else {
        throw new Error('db error');
      }
    }
  }

  async login(user) {
    try {
      const { username, pass } = user;
      const userQueryRes = await User.readUser(username);
      if (userQueryRes.rowCount == 0) {
        throw new Error(`User ${username} not found`);
      }
      const passIsValid = bcrypt.compareSync(pass, userQueryRes.rows[0].pass);
      if (!passIsValid) {
        throw new Error(`Incorrect password`);
      }
      const token = generateAccessToken(userQueryRes.rows[0].user_id);
      return token;
    } catch (exc) {
      console.log(exc);
      throw exc;
    }
  }
}

module.exports = new AuthService();

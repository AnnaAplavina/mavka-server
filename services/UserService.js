const User = require('./../data-access/User');
const bcrypt = require('bcryptjs');

class UserService {
  async getUser(username) {
    const res = await this.getUserPrivateInfo(username);
    delete res.email;
    return res;
  }

  async getUserPrivateInfo(username) {
    let readUserRes;
    try {
      readUserRes = await User.readUser(username);
    } catch (exc) {
      console.log(exc);
      throw new Error('Server error');
    }
    if (readUserRes.rows.length == 0) {
      throw new Error(`User with username ${username} does not exist`);
    } else {
      return {
        username: readUserRes.rows[0].username,
        email: readUserRes.rows[0].email,
        first_name: readUserRes.rows[0].first_name,
        last_name: readUserRes.rows[0].last_name,
        wall_id: readUserRes.rows[0].wall_id,
        avatar_url: readUserRes.rows[0].avatar_url,
      };
    }
  }

  async updateUser(newData) {
    try {
      const queryRes = await User.updateUser(
        newData.username,
        newData.new_email,
        newData.new_pass,
        newData.new_first_name,
        newData.new_last_name,
        newData.new_avatar
      );
      if (queryRes.rowCount == 0) {
        throw new Error(`User does not exist`);
      }
    } catch (exc) {
      if (exc.constraint == 'Users_email_key') {
        throw new Error('This email is already used');
      } else {
        console.log(exc);
        throw new Error('Server error');
      }
    }
  }

  async deleteUser(username) {
    try {
      const queryRes = await User.deleteUser(username);
      if (queryRes.rowCount != 1) {
        throw new Error('User not found');
      }
    } catch (exc) {
      if (exc.message != 'User not found') {
        console.log(exc);
        throw new Error('Server error');
      } else {
        throw exc;
      }
    }
  }
}

module.exports = new UserService();

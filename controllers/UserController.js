const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserService = require('./../services/UserService.js');

class UserController {
  async getUser(req, res) {
    try {
      const serviceRes = await UserService.getUser(req.params.username);
      return res.status(200).json(serviceRes);
    } catch (exc) {
      if (exc.message.startsWith('User with username')) {
        return res.status(404).json({ message: exc.message });
      }
      console.log(exc);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async getUserPrivateInfo(req, res) {
    try {
      const serviceRes = await UserService.getUserPrivateInfo(
        req.params.username
      );
      return res.status(200).json(serviceRes);
    } catch (exc) {
      console.log(exc);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async updateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Incorrect values error', errors: errors.errors });
    }

    const newData = {
      username: req.params.username,
      new_email: req.body.email,
      new_pass: bcrypt.hashSync(req.body.pass, 7),
      new_first_name: req.body.first_name,
      new_last_name: req.body.last_name,
      new_avatar: req.body.avatar_url,
    };

    try {
      await UserService.updateUser(newData);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (exc) {
      if (exc.message == 'Server error') {
        return res.status(500).json({ message: 'Server error' });
      } else {
        return res.status(409).json({ message: exc.message });
      }
    }
  }

  async deleteuser(req, res) {
    const username = req.params.username;
    try {
      await UserService.deleteUser(username);
      res.status(200).json({ message: 'User deleted' });
    } catch (exc) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new UserController();

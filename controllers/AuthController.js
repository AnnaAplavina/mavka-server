const { validationResult } = require('express-validator');
const AuthService = require('./../services/AuthService');

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Registration error', errors: errors.errors });
      }
      await AuthService.registration({
        email: req.body.email,
        username: req.body.username,
        pass: req.body.pass,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      });
      res.status(200).json({ message: 'User registered' });
    } catch (exc) {
      if (exc.message == 'db error') {
        return res.status(500).json({
          message: 'Server error',
        });
      } else {
        return res.status(409).json({ message: exc.message });
      }
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Login error', errors: errors.errors });
      }
      const user = {
        username: req.body.username,
        pass: req.body.pass,
      };
      const token = await AuthService.login(user);
      return res.status(200).json({ token });
    } catch (exc) {
      if (exc.message == 'db error') {
        return res.status(500).json({
          message: 'Server error',
        });
      }
      console.log(exc);
      res.status(401).json({ message: exc.message });
    }
  }
}

module.exports = new AuthController();

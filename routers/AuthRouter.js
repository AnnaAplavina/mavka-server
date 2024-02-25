const Router = require('express');
const { check } = require('express-validator');
const AuthConstroller = require('./../controllers/AuthController.js');

const authRouter = new Router();

authRouter.post(
  '/registration',
  [
    check('username', 'Username can not be empty').notEmpty(),
    check('email', 'Email can not be empty').notEmpty(),
    check('pass', 'Password can not be empty').notEmpty(),
    check(
      'pass',
      'Password length is incorrect - must be 4 to 64 symbols'
    ).isLength({ min: 4, max: 64 }),
    check('first_name', 'First name can not be empty').notEmpty(),
    check('last_name', 'Last name can not be empty').notEmpty(),
  ],
  AuthConstroller.registration
);

authRouter.post(
  '/login',
  [
    check('username', 'Username can not be empty').notEmpty(),
    check('pass', 'Password can not be empty').notEmpty(),
  ],
  AuthConstroller.login
);

module.exports = authRouter;

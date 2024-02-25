const AuthHelper = require('./../helpers/AuthHelper');
const User = require('./../data-access/User');

module.exports = async function (req, res, next) {
  try {
    if (req.headers.authorization === undefined) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    req.user_id = AuthHelper.simpleAuthorize(token).id;
    const queryRes = await User.readUserById(req.user_id);
    if (queryRes.rows.length == 0) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: 'Not authorized' });
  }
};

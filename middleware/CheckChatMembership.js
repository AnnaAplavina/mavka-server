const Chat = require('./../data-access/Chat');

module.exports = async function (req, res, next) {
  try {
    const isMember = await Chat.checkIfChatMemeberByUserId(
      req.user_id,
      req.params.room_id
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: 'Access denied. Not a room member.' });
    } else {
      next();
    }
  } catch (exc) {
    console.log(exc);
    return res.status(500).json({ message: 'Error' });
  }
};

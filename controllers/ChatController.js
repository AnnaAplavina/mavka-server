const User = require('./../data-access/User');
const ChatService = require('./../services/ChatService');

const { validationResult } = require('express-validator');

class ChatController {
  async getRoomMessages(req, res) {
    const room_id = req.params.room_id;
    const page = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    try {
      let queryRes;
      if (isNaN(page) || isNaN(pageSize)) {
        queryRes = await ChatService.getRoomMessages(room_id);
      } else {
        if (page <= 0 || pageSize <= 0) {
          return res.status(400).json({
            message:
              'Invalid page or pageSize values. They should be greater than 0.',
          });
        }
        queryRes = await ChatService.getRoomMessages(room_id, page, pageSize);
      }
      return res.status(200).json(queryRes);
    } catch (exc) {
      console.log(exc.message);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async addMessage(req, res) {
    const room_id = req.params.room_id;
    const user_id = req.user_id;
    const message_text = req.body.message_text;
    try {
      const { message_id, created_time } = await ChatService.addMessage(
        room_id,
        user_id,
        message_text
      );
      const user = await User.readUserById(user_id);
      const message = {
        message_id,
        username: user.rows[0].username,
        avatar_url: user.rows[0].avatar_url,
        first_name: user.rows[0].first_name,
        last_name: user.rows[0].last_name,
        text: message_text,
        created_time,
      };
      req.io.to(`chat room ${room_id}`).emit('new message', message);
      res.status(200).json({ message: 'Success' });
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }

  async addNewRoom(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Incorrect values error', errors });
    }

    const room_name = req.body.room_name;
    try {
      const queryRes = await ChatService.addNewRoom(req.user_id, room_name);
      return res.status(200).json(queryRes);
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }

  async addPersonal(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Incorrect values error', errors });
    }

    const user_id = req.user_id;
    const another_user = req.params.username;
    const text = req.body.text;
    try {
      const mesgRes = await ChatService.addPersonal(
        user_id,
        another_user,
        text
      );
      res.status(200).json({ message: 'Success' });
      req.io
        .to(`personal ${mesgRes.another_user_id}`)
        .emit('new personal message', mesgRes.msg_text);
      req.io
        .to(`personal ${user_id}`)
        .emit('new personal message', mesgRes.msg_text);
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }
}

module.exports = new ChatController();

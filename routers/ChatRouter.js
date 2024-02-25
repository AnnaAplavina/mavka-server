const Router = require('express');
const { check } = require('express-validator');
const authMiddleware = require('./../middleware/AuthMiddleware.js');
const checkMembershipMiddleware = require('./../middleware/CheckChatMembership.js');
const chatController = require('./../controllers/ChatController.js');

const chatRouter = new Router();

chatRouter.get(
  '/message/:room_id',
  [authMiddleware, checkMembershipMiddleware],
  chatController.getRoomMessages
);

chatRouter.post(
  '/message/:room_id',
  [authMiddleware, checkMembershipMiddleware],
  chatController.addMessage
);

chatRouter.post(
  '/newroom',
  [check('room_name', 'Room name can not be empty').notEmpty(), authMiddleware],
  chatController.addNewRoom
);

chatRouter.post(
  '/personal-message/:username',
  [check('text', 'Mesage text can not be empty').notEmpty(), authMiddleware],
  chatController.addPersonal
);

module.exports = chatRouter;

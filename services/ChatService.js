const Chat = require('./../data-access/Chat');

class ChatService {
  async getRoomMessages(roomId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const query_res = await Chat.getChatMessagesByUsers(
      roomId,
      offset,
      pageSize
    );
    return query_res.rows;
  }
  async addMessage(room_id, user_id, message_text) {
    const query_res = await Chat.addMessageByUser(
      user_id,
      message_text,
      room_id
    );
    return query_res.rows[0];
  }

  async addNewRoom(user_id, room_name) {
    const queryRes = await Chat.createRoom(user_id, room_name);
    return queryRes.rows[0];
  }

  async addPersonal(user_id, another_user, text) {
    return await Chat.addPersonalMsg(user_id, another_user, text);
  }
}

module.exports = new ChatService();

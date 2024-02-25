const pool = require('./Pool.js');
const User = require('./User.js');

class Chat {
  async checkIfChatMember(username, room_id) {
    const query =
      'SELECT COUNT(*) FROM chat_memberships ' +
      'JOIN users USING(user_id) ' +
      'WHERE room_id = $1 AND username = $2';

    const queryRes = await pool.query(query, [room_id, username]);
    return queryRes.rows[0].count !== 0;
  }

  async checkIfChatMemberByUserId(user_id, room_id) {
    const query =
      'SELECT COUNT(*) FROM chat_memberships ' +
      'WHERE room_id = $1 AND user_id = $2';

    const queryRes = await pool.query(query, [room_id, user_id]);
    return queryRes.rows[0].count !== 0;
  }

  async addToChat(username, room_id) {
    const userId = (await User.readUser(username)).rows[0].user_id;
    const query =
      'INSERT INTO chat_memberships(room_id, user_id) ' + 'VALUES($1, $2)';

    const queryRes = await pool.query(query, [room_id, userId]);
    return queryRes;
  }

  async createRoom(userId, room_name) {
    const createChatQuery =
      'INSERT INTO chat_rooms(chat_name) ' + 'VALUES($1) RETURNING room_id';

    let res;

    const client = await pool.connect();
    await client.query('BEGIN');
    try {
      const createChatRes = await client.query(createChatQuery, [room_name]);
      const chatId = createChatRes.rows[0].room_id;
      const addOwnerToChatQuery =
        'INSERT INTO chat_memberships(room_id, user_id, is_owner) ' +
        'VALUES ($1, $2, true)';
      await client.query(addOwnerToChatQuery, [chatId, userId]);
      await client.query('COMMIT');
      res = createChatRes;
    } catch (exc) {
      await client.query('ROLLBACK');
      throw exc;
    } finally {
      client.release();
    }
    return res;
  }

  async addMessageByUser(user_id, message_text, room_id) {
    const query =
      'INSERT INTO messages(user_id, message_text, room_id) ' +
      'VALUES($1, $2, $3) RETURNING message_id, created_time';

    return await pool.query(query, [user_id, message_text, room_id]);
  }

  async getChatMessagesByUsers(room_id, offset, limit) {
    const query =
      'SELECT username, first_name, last_name, message_text, avatar_url, created_time ' +
      'FROM messages ' +
      'JOIN users USING(user_id) ' +
      'WHERE messages.user_id IS NOT NULL AND room_id = $1 ' +
      'OFFSET $2 LIMIT $3';

    const queryRes = await pool.query(query, [room_id, offset, limit]);
    return queryRes;
  }

  async addPersonalMsg(user_id, another_user, text) {
    const anotherUserInfo = await User.readUser(another_user);
    const anotherUserId = anotherUserInfo.rows[0].user_id;
    const query = 'INSERT INTO personal_messages VALUES($1, $2, $3)';

    await pool.query(query, [user_id, anotherUserId, text]);
    return { another_user_id: anotherUserId, msg_text: text };
  }
}

module.exports = new Chat();

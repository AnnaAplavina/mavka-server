const pool = require('./Pool.js');

class User {
  async readUser(username) {
    const query = `
      SELECT user_id, username, email, pass, first_name, last_name, users.wall_id, avatar_url
      FROM users
      WHERE username = $1`;
    return await pool.query(query, [username]);
  }

  async readUserById(id) {
    const query = `
      SELECT user_id, username, email, pass, first_name, last_name, users.wall_id, avatar_url
      FROM users
      WHERE user_id = $1`;
    return await pool.query(query, [id]);
  }

  async addUser(email, username, pass, first_name, last_name) {
    const client = await pool.connect();
    let res;
    await client.query('BEGIN');

    try {
      let wall_id;
      let user_id;
      const createWallQuery =
        'INSERT INTO walls DEFAULT VALUES RETURNING wall_id';
      const createWallRes = await client.query(createWallQuery);
      wall_id = createWallRes.rows[0].wall_id;
      const createUserQuery = `
        INSERT INTO users(email, username, pass, first_name, last_name, wall_id)
        VALUES($1, $2, $3, $4, $5, $6) RETURNING user_id`;
      const createUserRes = await client.query(createUserQuery, [
        email,
        username,
        pass,
        first_name,
        last_name,
        wall_id,
      ]);
      user_id = createUserRes.rows[0].user_id;
      const updateWallQuery = `
        UPDATE walls
        SET wall_user_id = $1
        WHERE wall_id = $2`;
      await client.query(updateWallQuery, [user_id, wall_id]);
      await client.query('COMMIT');
      res = createUserRes;
    } catch (exc) {
      await client.query('ROLLBACK');
      throw exc;
    } finally {
      client.release();
    }
    return res.rows[0];
  }

  async updateUser(
    username,
    new_email,
    new_pass,
    new_first_name,
    new_last_name,
    new_avatar
  ) {
    const updateUserQuery = `
      UPDATE users
      SET email = $1, pass = $2, first_name = $3, last_name = $4, avatar_url = $5
      WHERE username = $6`;
    const values = [
      new_email,
      new_pass,
      new_first_name,
      new_last_name,
      new_avatar || null,
      username,
    ];
    return pool.query(updateUserQuery, values);
  }

  async deleteUser(username) {
    const deleteUserQuery = 'DELETE FROM users WHERE username = $1';
    return pool.query(deleteUserQuery, [username]);
  }
}

module.exports = new User();

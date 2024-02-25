const pool = require('./Pool.js');

class Group {
  async getAll() {
    const query =
      'SELECT group_id, group_name, wall_id, avatar_url FROM groups';
    return await pool.query(query);
  }

  async addGroup(group_name, owner_id) {
    const client = await pool.connect();
    let res;
    await client.query('BEGIN');

    try {
      let wall_id;
      let group_id;
      const createWallQuery =
        'INSERT INTO walls DEFAULT VALUES RETURNING wall_id';
      const createWallRes = await client.query(createWallQuery);
      wall_id = createWallRes.rows[0].wall_id;

      const createGroupQuery =
        'INSERT INTO groups(owner_id, group_name, wall_id) ' +
        'VALUES($1, $2, $3) RETURNING group_id, owner_id, group_name, wall_id';

      const createGroupRes = await client.query(createGroupQuery, [
        owner_id,
        group_name,
        wall_id,
      ]);
      group_id = createGroupRes.rows[0].group_id;

      const updateWallQuery =
        'UPDATE walls ' + 'SET wall_group_id = $1 WHERE wall_id = $2';

      await client.query(updateWallQuery, [group_id, wall_id]);
      await this.joinGroup(owner_id, group_id, true, client);

      await client.query('COMMIT');
      res = createGroupRes.rows[0];
    } catch (exc) {
      await client.query('ROLLBACK');
      throw exc;
    } finally {
      client.release();
    }
    return res;
  }

  async joinGroup(user_id, group_id, is_moderator, client = pool) {
    const role = is_moderator ? 'moderator' : null;
    const query = role
      ? 'INSERT INTO group_memberships(user_id, group_id, role) VALUES ($1, $2, $3)'
      : 'INSERT INTO group_memberships(user_id, group_id) VALUES ($1, $2)';

    const queryRes = await client.query(query, [user_id, group_id, role]);
    return queryRes;
  }
}

module.exports = new Group();

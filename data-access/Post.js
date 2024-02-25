const pool = require('./Pool.js');

class Post {
  async getWallPosts(wall_id, offset, limit) {
    const query =
      'SELECT post_id, username, avatar_url, posts.wall_id, post_text, created_at' +
      ' FROM posts JOIN ' +
      'users USING(user_id) WHERE posts.wall_id = $1 ' +
      'ORDER BY created_at DESC ' +
      'OFFSET $2 LIMIT $3';
    const queryRes = await pool.query(query, [wall_id, offset, limit]);
    return queryRes;
  }

  async getNews(user_id) {
    const query =
      'SELECT post_id, username, avatar_url, posts.wall_id, post_text, created_at' +
      ' FROM posts JOIN ' +
      'users USING(user_id)';
    const queryRes = await pool.query(query);
    return queryRes.rows;
  }

  async addPost(wall_id, user_id, group_id, post_text, reposted_post_id) {
    if (group_id == null && user_id == null) {
      throw new Error('Need user_id or group_id');
    }

    let query;
    let values;

    if (user_id) {
      query =
        'INSERT INTO posts(wall_id, user_id, post_text) VALUES($1, $2, $3) RETURNING post_id';
      values = [wall_id, user_id, post_text];
    } else {
      query =
        'INSERT INTO posts(wall_id, group_id, post_text) VALUES($1, $2, $3) RETURNING post_id';
      values = [wall_id, group_id, post_text];
    }

    const client = await pool.connect();
    await client.query('BEGIN');

    try {
      const createPostRes = await client.query(query, values);
      const postId = createPostRes.rows[0].post_id;

      if (reposted_post_id) {
        const updateQuery =
          'UPDATE posts SET reposted_post_id = $1 WHERE post_id = $2';
        await client.query(updateQuery, [reposted_post_id, postId]);
      }

      await client.query('COMMIT');
    } catch (exc) {
      await client.query('ROLLBACK');
      throw exc;
    } finally {
      client.release();
    }
  }

  async getPostById(postId) {
    const query = 'SELECT * FROM posts WHERE post_id = $1';
    const res = await pool.query(query, [postId]);
    return res.rows;
  }
}

module.exports = new Post();

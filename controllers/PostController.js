const Post = require('./../data-access/Post.js');
const Wall = require('./../data-access/Wall.js');
const User = require('./../data-access/User.js');

class PostController {
  // need to check if a user has permission to add post as group!
  // create middleware
  async addPost(req, res) {
    try {
      if (req.body.username == null && req.body.group_id) {
        return res.status(400).json({ message: 'Need username or group_id' });
      }
      const readUserRes = await User.readUser(req.body.username);
      const user_id =
        readUserRes.rows.length != 0 ? readUserRes.rows[0].user_id : null;
      if (
        !Wall.checkAddPostPermission(
          user_id,
          req.body.group_id,
          req.body.wall_id
        )
      ) {
        return res.status(400).json({ message: 'Permission denied' });
      } else {
        await Post.addPost(
          req.body.wall_id,
          user_id,
          req.body.group_id,
          req.body.post_text,
          req.body.reposted_post_id
        );
        return res.status(200).json({ message: 'Success' });
      }
    } catch (exc) {
      console.log(exc);
      return res.status(500).json(exc);
    }
  }

  async getNews(req, res) {
    try {
      const user_id = req.user_id;
      const queryRes = await Post.getNews(user_id);
      res.status(200).json(queryRes);
    } catch (exc) {
      console.log(exc);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getWallPosts(req, res) {
    const wall_id = req.params.wall_id;
    let page = parseInt(req.query.page, 10);
    let pageSize = parseInt(req.query.pageSize, 10);

    let offset;

    try {
      if (isNaN(page) || isNaN(pageSize)) {
        page = 1;
        pageSize = 10;
      }
      offset = (page - 1) * pageSize;
      const queryRes = await Post.getWallPosts(wall_id, offset, pageSize);
      return res.status(200).json(queryRes.rows);
    } catch (exc) {
      console.log(exc);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getPostById(req, res) {
    try {
      const postId = req.params.post_id;
      const queryRes = await Post.getPostById(postId);
      if (queryRes.length != 1) {
        return res.status(404).json({ message: 'Post not found' });
      } else {
        return res.status(200).json(queryRes[0]);
      }
    } catch (exc) {
      console.log(exc);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new PostController();

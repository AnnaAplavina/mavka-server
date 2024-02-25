const Router = require('express');
const PostController = require('./../controllers/PostController.js');
const authMiddleware = require('./../middleware/AuthMiddleware.js');

const postRouter = new Router();

postRouter.post('/wall-post', [authMiddleware], PostController.addPost);
postRouter.get(
  '/wall-post/:wall_id',
  [authMiddleware],
  PostController.getWallPosts
);

postRouter.get(
  '/single-post/:post_id',
  [authMiddleware],
  PostController.getPostById
);

postRouter.get('/news', [authMiddleware], PostController.getNews);

module.exports = postRouter;

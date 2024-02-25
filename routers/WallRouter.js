const Router = require('express');
const WallController = require('../controllers/WallController.js');
const authMiddleware = require('./../middleware/AuthMiddleware.js');

const wallRouter = new Router();

wallRouter.get('/group-walls', authMiddleware, WallController.getGroupWalls);
wallRouter.put(
  '/search-walls',
  authMiddleware,
  WallController.searchGroupWalls
);

wallRouter.get('/wall-themes', authMiddleware, WallController.getWallThemes);

module.exports = wallRouter;

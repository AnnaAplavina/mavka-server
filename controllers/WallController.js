const Wall = require('./../data-access/Wall');

class WallController {
  async getGroupWalls(req, res) {
    try {
      const queryRes = await Wall.getGroupWalls();
      return res.status(200).json(queryRes);
    } catch (exc) {
      console.log(exc.message);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async searchGroupWalls(req, res) {
    try {
      const queryRes = await Wall.searchGroupWalls(
        req.body.title,
        req.body.theme
      );
      return res.status(200).json(queryRes);
    } catch (exc) {
      console.log(exc.message);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getWallThemes(req, res) {
    try {
      res.status(200).json({
        themes: [
          'Юмор',
          'Спорт',
          'Игры',
          'Еда',
          'Музыка',
          'Фотография',
          'Финансы',
          'Информационные технологии',
          'Кино',
          'Наука',
        ],
      });
    } catch (exc) {
      console.log(exc.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new WallController();

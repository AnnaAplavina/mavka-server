const Group = require('./../data-access/Group');

class GroupController {
  async getAll(req, res) {
    try {
      const queryRes = await Group.getAll();
      res.status(200).json(queryRes.rows);
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }

  async addGroup(req, res) {
    try {
      const queryRes = await Group.addGroup(req.body.group_name, req.user_id);
      delete queryRes.owner_id;
      res.status(200).json(queryRes);
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }

  async joinGroup(req, res) {
    const group_id = req.params.group_id;
    const user_id = req.user_id;
    try {
      await Group.joinGroup(group_id, user_id, false);
      res.status(200).json({ message: 'Success' });
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }
}

module.exports = new GroupController();

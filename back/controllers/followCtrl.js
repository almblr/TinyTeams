import { follow } from "../db/sequelize.js";

const followCtrl = {
  create: async (req, res) => {
    console.log(req.body);
    try {
      const Follow = await follow.create({
        author: req.auth.userId,
        isFollowing: req.body.userId || null,
      });
      res.status(200).send(Follow);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};

export default followCtrl;

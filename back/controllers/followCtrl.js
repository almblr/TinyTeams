import { follow, user } from "../db/sequelize.js";

const followCtrl = {
  create: async (req, res) => {
    try {
      const userToFollow = await user.findOne({
        where: { id: req.body.userId },
      });
      if (!userToFollow)
        return res.status(400).send({ error: "This user doesn't exist." });
      if (userToFollow.id === req.auth.userId)
        return res.status(400).send({ error: "You can't follow yourself." });
      const Follow = await follow.create({
        author: req.auth.userId,
        isFollowing: userToFollow.id,
      });
      res.status(201).send(Follow);
    } catch {
      res.status(500).send();
    }
  },
};

export default followCtrl;

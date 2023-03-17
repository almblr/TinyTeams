import { follow, user } from "../db/sequelize.js";

const followController = {
  create: async (req, res) => {
    try {
      const userToFollow = await user.findByPk(req.params.userId);
      if (!userToFollow)
        return res.status(400).send({ error: "Non existant user" });
      if (userToFollow.id === req.auth.userId)
        return res.status(400).send({ error: "You can't follow yourself" });
      const isAlreadyFollow = await follow.findOne({
        where: {
          author: req.auth.userId,
          isFollowing: req.params.userId,
        },
      });
      if (isAlreadyFollow) {
        return res.status(400).send({ error: "User already followed" });
      }
      const newFollow = await follow.create({
        author: req.auth.userId,
        isFollowing: req.params.userId,
      });
      res.status(201).send(newFollow);
    } catch {
      res.status(500).send();
    }
  },
  getOne: async (req, res) => {
    try {
      const Follow = await follow.findOne({
        where: {
          author: req.auth.userId,
          isFollowing: req.params.userId,
        },
      });
      if (!Follow) {
        return res.status(200).send(false);
      }
      res.status(200).send(true);
    } catch {
      res.status(500).send();
    }
  },
  delete: async (req, res) => {
    try {
      const Follow = await follow.findOne({
        where: {
          author: req.auth.userId,
          isFollowing: req.params.userId,
        },
      });
      await Follow.destroy();
      res.status(201).send({ message: "User unfollowed" });
    } catch {
      res.status(500).send();
    }
  },
};

export default followController;

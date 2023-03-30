import { Follow, User } from "../db/sequelize.js";

const followController = {
  create: async (req, res) => {
    try {
      const userToFollow = await User.findByPk(req.params.userId);
      if (!userToFollow)
        return res.status(400).send({ error: "Non existant user" });
      if (userToFollow.id === req.auth.userId)
        return res.status(400).send({ error: "You can't follow yourself" });
      const isAlreadyFollow = await Follow.findOne({
        where: {
          author: req.auth.userId,
          isFollowing: parseInt(req.params.userId),
        },
      });
      if (isAlreadyFollow) {
        return res.status(400).send({ error: "User already followed" });
      }
      const newFollow = await Follow.create({
        author: req.auth.userId,
        isFollowing: parseInt(req.params.userId),
      });
      res.status(201).send(newFollow);
    } catch {
      res.status(500).send();
    }
  },
  getOne: async (req, res) => {
    try {
      const follow = await Follow.findOne({
        where: {
          author: req.auth.userId,
          isFollowing: parseInt(req.params.userId),
        },
      });
      if (!follow) {
        return res.status(200).send({
          message: "Follow not found",
        });
      }
      res.status(200).send(follow);
    } catch {
      res.status(500).send();
    }
  },
  delete: async (req, res) => {
    try {
      const follow = await Follow.findOne({
        where: {
          id: parseInt(req.params.followId),
        },
      });
      await follow.destroy();
      res.status(201).send({ message: "User unfollowed" });
    } catch {
      res.status(500).send();
    }
  },
};

export default followController;

import { Follow, User } from "../db/sequelize.js";

const followController = {
  create: async (req, res) => {
    try {
      const userToFollow = await User.findByPk(req.params.userId);
      !userToFollow
        ? res.status(400).send({ error: "Non existant user" })
        : null;
      userToFollow.id === req.auth.userId
        ? res.status(400).send({ error: "You can't follow yourself" })
        : null;
      const isAlreadyFollowing = await Follow.findOne({
        where: {
          author: req.auth.userId,
          isFollowing: parseInt(req.params.userId),
        },
      });
      isAlreadyFollowing
        ? res.status(400).send({ error: "User already followed" })
        : null;

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
          isFollowing: req.params.userId,
        },
      });
      !follow
        ? res.status(200).send({
            message: "Follow not found",
          })
        : res.status(200).send(follow);
    } catch {
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const followers = await Follow.findAll({
        where: {
          isFollowing: req.params.userId,
        },
      });
      res.status(200).send(followers);
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

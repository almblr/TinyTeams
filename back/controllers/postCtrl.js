import { post, react, user, comment } from "../db/sequelize.js";
import fs from "fs";
import { Op } from "sequelize";

const postCtrl = {
  create: async (req, res) => {
    if (!req.body.content && !req.file) {
      return res.status(400).json({ message: "Post vide." });
    }
    try {
      const Post = await post.create({
        userId: req.auth.userId,
        content: req.body.content,
        imageUrl: req.file?.filename
          ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
          : null,
        author: req.auth.userId,
      });
      res.status(201).send(Post);
    } catch {
      res.status(500).send();
    }
  },
  getOne: async (req, res) => {
    try {
      const userComments = await comment.findAll({
        where: {
          author: req.auth.userId,
          postId: req.params.postId,
        },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: user,
            attributes: ["id", "firstname", "lastname", "profilPicture"],
          },
        ],
      });
      const othersComments = await comment.findAll({
        where: {
          postId: req.params.postId,
          author: {
            [Op.ne]: req.auth.userId, // Remove comments of the connected user
          },
        },
        include: [
          {
            model: user,
            attributes: ["id", "firstname", "lastname", "profilPicture"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const Post = await post.findOne({
        where: {
          id: req.params.postId,
        },
        include: [
          react,
          {
            model: user,
            attributes: ["id", "firstname", "lastname", "profilPicture"],
          },
        ],
      });
      const allComments = userComments.concat(othersComments);
      Post.setDataValue("comments", allComments);
      res.status(200).send(Post);
    } catch {
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const allPosts = await post.findAll({
        order: [
          ["createdAt", "DESC"], // Du plus récent au moins récent
        ],
        include: [
          react,
          {
            model: user,
            attributes: ["id", "firstname", "lastname", "profilPicture"],
          },
        ],
      });
      for (const post of allPosts) {
        const userComments = await comment.findAll({
          where: {
            author: req.auth.userId,
            postId: post.id,
          },
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: user,
              attributes: ["id", "firstname", "lastname", "profilPicture"],
            },
          ],
        });
        const othersComments = await comment.findAll({
          where: {
            postId: post.id,
            author: {
              [Op.ne]: req.auth.userId, // Ne mets pas les commentaires de l'utilisateurs
            },
          },
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: user,
              attributes: ["id", "firstname", "lastname", "profilPicture"],
            },
          ],
        });
        const allComments = userComments.concat(othersComments);
        post.setDataValue("comments", allComments);
      }
      res.status(200).send(allPosts);
    } catch {
      res.status(500).send();
    }
  },

  update: async (req, res) => {
    const Post = await post.findByPk(req.params.postId);
    if (req.auth.userId !== Post.author) {
      return res.status(401).json({ message: "You cannot update this post." });
    }
    try {
      await Post.update({
        content: req.body.content || null,
      });
      res.status(201).send(Post);
    } catch {
      res.status(500).send();
    }
  },
  delete: async (req, res) => {
    const Post = await post.findByPk(req.params.postId);
    if (req.auth.userId !== Post.author && req.auth.isAdmin === false) {
      return res.status(401).json({ message: "You cannot delete this post." });
    }
    try {
      if (Post.imageUrl) {
        const filename = Post.imageUrl.split("/images/")[1];
        await fs.promises.unlink(`images/${filename}`);
      }
      await Post.destroy();
      res.status(200).json({ message: "Post deleted." });
    } catch {
      res.status(500).send();
    }
  },
};

export default postCtrl;

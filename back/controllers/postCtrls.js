import { post, react, user, comment } from "../db/sequelize.js"; // sans les { } il ne reconnait pas posts car il n'a pas été exporté avec export default
import fs from "fs";
import { Op } from "sequelize";

/* Controller POST */
const postController = {
  createOne: async (req, res) => {
    if (!req.body.content && !req.file) {
      console.log(req.body);
      res.status(400).json({ message: "Post vide." });
    } else {
      try {
        const Post = await post.create({
          userId: req.auth.userId,
          content: req.body.content,
          imageUrl: req.file?.filename
            ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            : null,
          author: req.auth.userId,
        });
        res.status(200).send(Post);
      } catch (err) {
        res.status(400).send(err);
      }
    }
  },
  getOne: async (req, res) => {
    try {
      const myComment = await comment.findAll({
        where: {
          author: req.auth.userId,
        },
        order: [["createdAt", "DESC"]],
        attributes: ["content", "imageUrl"],
      });
      const otherComments = await comment.findAll({
        where: {
          postId: req.params.id,
          author: {
            [Op.ne]: req.auth.userId, // Ne mets pas les commentaires de l'utilisateurs
          },
        },
        order: [["createdAt", "DESC"]],
      });
      const Post = await post.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          react,
          {
            model: user,
            attributes: ["id", "firstName", "lastName", "profilPicture"],
          },
        ],
      });
      Post.setDataValue("myComment", myComment);
      Post.setDataValue("otherComments", otherComments);
      res.status(200).send(Post);
    } catch {
      res.status(400);
    }
  },
  getAll: async (req, res) => {
    try {
      let allPosts = await post.findAll({
        order: [
          ["createdAt", "DESC"], // Du plus récent au moins récent
        ],
        include: [
          react,
          {
            model: user,
            attributes: ["firstName", "lastName", "profilPicture"],
          },
        ],
      });

      for (const post of allPosts) {
        const myComment = await comment.findAll({
          where: {
            author: req.auth.userId,
            postId: post.id,
          },
          order: [["createdAt", "DESC"]],
          attributes: ["content", "imageUrl"],
        });
        const otherComments = await comment.findAll({
          where: {
            postId: post.id,
            author: {
              [Op.ne]: req.auth.userId, // Ne mets pas les commentaires de l'utilisateurs
            },
          },
          order: [["createdAt", "DESC"]],
        });
        post.setDataValue("myComment", myComment);
        post.setDataValue("otherComments", otherComments);
      }
      res.status(200).send(allPosts);
    } catch {
      res.status(400);
    }
  },

  updateOne: async (req, res) => {
    const Post = await post.findByPk(req.params.id);
    if (!Post || (req.auth.userId !== Post.author && req.auth.role === false)) {
      res.status(401).json({ message: "You cannot update this post." });
      return;
    }
    try {
      // update the content of the post
      await Post.update({
        content: req.body.content || null,
      });
      // send the updated post as the response
      res.status(200).send(Post);
    } catch (err) {
      // handle any errors
      res.status(400).send(err);
    }
  },
  deleteOne: async (req, res) => {
    const Post = await post.findByPk(req.params.id);
    if (!Post || (req.auth.userId !== Post.author && req.auth.role === false)) {
      res.status(401).json({ message: "You cannot delete this post." });
      return;
    }
    try {
      // Si le post contenait une image
      if (Post.imageUrl) {
        const filename = Post.imageUrl.split("/images/")[1];
        await fs.promises.unlink(`images/${filename}`);
      }
      await Post.destroy();
      res.status(200).json({ message: "Post deleted." });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};

export default postController;

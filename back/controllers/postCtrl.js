import { post, react, user, comment } from "../db/sequelize.js";
import fs from "fs";
import { Op } from "sequelize";

const getPostComments = async (author, postId) => {
  const userComments = await comment.findAll({
    where: {
      author,
      postId,
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
      postId,
      author: {
        [Op.ne]: author, // Remove comments of the connected user
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
  return userComments.concat(othersComments);
};

/////////////////////////////////////////
/////////////////////////////////////////

const postController = {
  create: async (req, res) => {
    if (!req.body.content && !req.file) {
      return res.status(400).json({ message: "Empty post." });
    }
    try {
      const createdPost = await post.create({
        userId: req.auth.userId,
        content: req.body.content,
        imageUrl: req.file?.filename
          ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
          : null,
        author: req.auth.userId,
      });
      const Post = await post.findByPk(createdPost.id, {
        include: [
          react,
          {
            model: user,
            attributes: ["id", "firstname", "lastname", "profilPicture"],
          },
          comment,
        ],
      });
      res.status(201).send(Post);
    } catch {
      res.status(500).send();
    }
  },
  getOne: async (req, res) => {
    try {
      const Post = await post.findByPk(req.params.postId, {
        include: [
          react,
          {
            model: user,
            attributes: ["id", "firstname", "lastname", "profilPicture"],
          },
        ],
      });
      const PostComments = await getPostComments(
        req.auth.userId,
        req.params.postId
      );
      Post.setDataValue("comments", PostComments);
      res.status(200).send(Post);
    } catch {
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const allPosts = await post.findAll({
        where: "userId" in req.query ? { author: req.query.userId } : {},
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
      for (const Post of allPosts) {
        const PostComments = await getPostComments(req.auth.userId, Post.id);
        Post.setDataValue("comments", PostComments);
      }
      // For the infinite scroll, to display nexts posts
      if ("lastPostId" in req.query) {
        const lastPost = allPosts.findIndex(
          (post) => post.id === parseInt(req.query.lastPostId)
        );
        if (lastPost === -1) {
          return res.status(400).send({ message: "Post not found" });
        }
        const start = lastPost + 1;
        const end = start + 10;
        if (start + 1 === allPosts.length) {
          return;
        }
        return res.status(200).send(allPosts.slice(start, end));
      }
      res.status(200).send(allPosts.slice(0, 10));
    } catch {
      res.status(500).send();
    }
  },
  update: async (req, res) => {
    const Post = await post.findByPk(req.params.postId);
    if (req.auth.userId !== Post.author) {
      return res.status(401).json({ message: "You cannot update this post" });
    }
    try {
      const updatedPost = await Post.update({
        content: req.body.content || null,
      });
      const postToSend = await post.findByPk(updatedPost.id, {
        include: [
          react,
          {
            model: user,
            attributes: ["id", "firstname", "lastname", "profilPicture"],
          },
          comment,
        ],
      });
      res.status(201).send(postToSend);
    } catch {
      res.status(500).send();
    }
  },
  delete: async (req, res) => {
    const Post = await post.findByPk(req.params.postId);
    if (req.auth.userId !== Post.author && req.auth.isAdmin === false) {
      return res.status(401).json({ message: "You cannot delete this post" });
    }
    try {
      if (Post.imageUrl) {
        const filename = Post.imageUrl.split("/images/")[1];
        await fs.promises.unlink(`images/${filename}`);
      }
      await Post.destroy();
      res.status(200).json({ message: "Post deleted" });
    } catch {
      res.status(500).send();
    }
  },
};

export default postController;

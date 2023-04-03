import { Post, React, User, Comment } from "../db/sequelize.js";
import fs from "fs";
import { Op } from "sequelize";

const getPostComments = async (author, postId) => {
  const userComments = await Comment.findAll({
    where: {
      author,
      postId,
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["id", "firstname", "lastname", "profilePicture"],
      },
    ],
  });
  const othersComments = await Comment.findAll({
    where: {
      postId,
      author: {
        [Op.ne]: author, // Remove comments of the connected user
      },
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstname", "lastname", "profilePicture"],
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
    if (!req.body.content && Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Empty post." });
    }
    try {
      const createdPost = await Post.create({
        userId: req.auth.userId,
        content: req.body.content,
        imageUrl: req.files?.imageUrl
          ? `${req.protocol}://${req.get("host")}/images/${
              req.files.imageUrl[0].filename
            }`
          : null,
        author: req.auth.userId,
      });
      const post = await Post.findByPk(createdPost.id, {
        include: [
          React,
          {
            model: User,
            attributes: ["id", "firstname", "lastname", "profilePicture"],
          },
          Comment,
        ],
      });
      res.status(201).send(post);
    } catch {
      res.status(500).send();
    }
  },
  getOne: async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.postId, {
        include: [
          React,
          {
            model: User,
            attributes: ["id", "firstname", "lastname", "profilePicture"],
          },
        ],
      });
      const PostComments = await getPostComments(
        req.auth.userId,
        req.params.postId
      );
      post.setDataValue("comments", PostComments);
      res.status(200).send(post);
    } catch {
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const allPosts = await Post.findAll({
        where: "userId" in req.query ? { author: req.query.userId } : {},
        order: [
          ["createdAt", "DESC"], // Du plus récent au moins récent
        ],
        include: [
          React,
          {
            model: User,
            attributes: ["id", "firstname", "lastname", "profilePicture"],
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
        const nextPosts = allPosts.slice(start, end);
        if (nextPosts.length === 0) {
          return res.status(200).send({ message: "No more posts" });
        }
        if (start + 1 === allPosts.length) {
          return res.status(200).send(allPosts.slice(start, allPosts.length));
        }
        return res.status(200).send(nextPosts);
      }
      res.status(200).send(allPosts.slice(0, 10));
    } catch {
      res.status(500).send();
    }
  },
  update: async (req, res) => {
    const post = await Post.findByPk(req.params.postId);
    if (req.auth.userId !== post.author) {
      return res.status(401).json({ message: "You cannot update this post" });
    }
    try {
      const updatedPost = await post.update({
        content: req.body.content || null,
      });
      const postToSend = await Post.findByPk(updatedPost.id, {
        include: [
          React,
          {
            model: User,
            attributes: ["id", "firstname", "lastname", "profilePicture"],
          },
          Comment,
        ],
      });
      res.status(201).send(postToSend);
    } catch {
      res.status(500).send();
    }
  },
  delete: async (req, res) => {
    const post = await Post.findByPk(req.params.postId);
    if (req.auth.userId !== post.author && req.auth.isAdmin === false) {
      return res.status(401).json({ message: "You cannot delete this post" });
    }
    try {
      if (post.imageUrl) {
        const filename = post.imageUrl.split("/images/")[1];
        await fs.promises.unlink(`images/${filename}`);
      }
      await post.destroy();
      res.status(200).json({ message: "Post deleted" });
    } catch {
      res.status(500).send();
    }
  },
};

export default postController;

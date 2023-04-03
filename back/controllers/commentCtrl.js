import { Comment } from "../db/sequelize.js";
import fs from "fs";

const commentController = {
  create: async (req, res) => {
    if (
      !req.body.content &&
      Object.keys(req.files).length === 0 &&
      !req.body.imageUrl
    ) {
      return res.status(400).json({ message: "Empty comment" });
    }
    try {
      const comment = await Comment.create({
        author: req.auth.userId,
        postId: req.params.postId,
        content: req.body.content ? req.body.content : null,
        imageUrl: req.files?.imageUrl
          ? `${req.protocol}://${req.get("host")}/images/${
              req.files.imageUrl[0].filename
            }`
          : req.body.imageUrl,
      });
      res.status(201).send(comment);
    } catch {
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const allComments = await Comment.findAll({
        where: {
          postId: req.params.postId,
        },
        order: [
          ["createdAt", "DESC"], // Du plus récent au moins récent
        ],
      });
      res.status(200).send(allComments);
    } catch {
      res.status(500).send();
    }
  },
  update: async (req, res) => {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment || req.auth.userId !== comment.author) {
      return res
        .status(401)
        .json({ message: "You cannot update this comment" });
    }
    try {
      await comment.update({
        content: req.body.content || null,
      });
      res.status(201).send(comment);
    } catch {
      res.status(500).send();
    }
  },
  delete: async (req, res) => {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment || req.auth.userId !== comment.author) {
      return res
        .status(401)
        .json({ message: "You cannot delete this comment" });
    }
    try {
      if (comment.imageUrl) {
        const filename = comment.imageUrl.split("/images/")[1];
        filename ? await fs.promises.unlink(`images/${filename}`) : null;
      }
      await comment.destroy();
      res.status(200).json({ message: "Comment removed" });
    } catch {
      res.status(500).send();
    }
  },
};

export default commentController;

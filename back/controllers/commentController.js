import { Comment, User } from "../db/sequelize.js";
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
      const createdComment = await Comment.create({
        author: req.auth.userId,
        postId: parseInt(req.params.postId),
        content: req.body.content ? req.body.content : null,
        imageUrl: req.files?.imageUrl
          ? `${req.protocol}://${req.get("host")}/images/${
              req.files.imageUrl[0].filename
            }`
          : req.body.imageUrl,
      });
      const comment = await Comment.findByPk(createdComment.id, {
        include: [
          {
            model: User,
            attributes: ["id", "firstname", "lastname", "profilePicture"],
          },
        ],
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
      if ("lastCommentId" in req.query) {
        const lastComment = allComments.findIndex(
          (comment) => comment.id === parseInt(req.query.lastCommentId)
        );
        if (lastComment === -1) {
          return res.status(400).send({ message: "Comment not found" });
        }
        const start = lastComment + 1;
        const end = start + 10;
        const nextComments = allComments.slice(start, end);
        if (nextComments.length === 0) {
          return res.status(200).send({ message: "No more comments" });
        }
        if (start + 1 === allComments.length) {
          return res
            .status(200)
            .send(allComments.slice(start, allComments.length));
        }
        return res.status(200).send(nextComments);
      }
      res.status(200).send(allComments.slice(0, 10));
    } catch {
      res.status(500).send();
    }
  },
  update: async (req, res) => {
    const comment = await Comment.findByPk(req.params.commentId);
    console.log(comment);
    // console.log(req.auth.userId);
    // console.log(comment.author);
    if (!comment || req.auth.userId !== comment.author) {
      return res
        .status(401)
        .json({ message: "You cannot update this comment" });
    }
    try {
      const updatedComment = await comment.update({
        content: req.body.content || null,
      });
      const commentToSend = await Comment.findByPk(updatedComment.id, {
        include: [
          {
            model: User,
            attributes: ["id", "firstname", "lastname", "profilePicture"],
          },
        ],
      });
      res.status(201).send(commentToSend);
    } catch {
      res.status(500).send();
    }
  },
  delete: async (req, res) => {
    const comment = await Comment.findByPk(req.params.commentId);
    if (
      !comment ||
      (req.auth.userId !== comment.author && req.auth.role === true)
    ) {
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

import { post, react, user } from "../db/sequelize.js"; // sans les { } il ne reconnait pas posts car il n'a pas été exporté avec export default
import fs from "fs";

/* Controller POST */
const postController = {
  createOne: async (req, res) => {
    if (!req.body.content && !req.file) {
      res.status(400).json({ message: "Votre post ne peut pas être vide." });
    } else {
      try {
        const Post = await post.create({
          userId: req.auth.userId,
          content: req.body.content,
          imageUrl: req.file?.filename
            ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            : null,
          autor: req.auth.userId,
        });
        res.status(200).send(Post);
      } catch (err) {
        res.status(400).send(err);
      }
    }
  },
  getOne: async (req, res) => {
    try {
      const findPost = await post.findOne({
        where: {
          id: req.params.id,
        },
        include: [react, user],
      });
      res.status(200).send(findPost);
    } catch {
      res.status(400);
    }
  },
  getAll: async (req, res) => {
    try {
      let allPosts = [];
      allPosts = await post.findAll({
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
      res.status(200).send(allPosts);
    } catch {
      res.status(400);
    }
  },
  updateOne: async (req, res) => {
    const findPost = await post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (
      findPost &&
      req.auth.userId !== findPost.autor &&
      req.auth.role === false
    ) {
      res.status(401).json({ message: "Vous ne pouvez pas modifier ce post." });
    } else {
      if (findPost.imageUrl && req.body.content === "") {
        // Si le post de base a une image, on peut modifier et supprimer le texte
        try {
          findPost.update({
            content: null,
          });
          res.status(200).send(findPost);
        } catch {
          res.status(400).send(err);
        }
      } else {
        // Si le post n'a pas d'image
        try {
          findPost.update({
            content: req.body.content,
          });
          res.status(200).send(findPost);
        } catch {
          res.status(400).send(err);
        }
      }
    }
  },
  deleteOne: async (req, res) => {
    const findPost = await post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (
      findPost &&
      req.auth.userId !== findPost.autor &&
      req.auth.role === false
    ) {
      res
        .status(401)
        .json({ message: "Vous ne pouvez pas supprimer ce post." });
    } else {
      try {
        // Si le post contenait une image
        if (findPost.imageUrl) {
          const filename = findPost.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            findPost.destroy();
            res.status(200).json({ message: "Post supprimé" });
          });
        } else {
          // S'il n'y avait que du texte
          findPost.destroy();
          res.status(200).json({ message: "Post supprimé" });
        }
      } catch (err) {
        res.status(400).send(err);
      }
    }
  },
};

export default postController;

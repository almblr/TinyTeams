import { comment } from "../db/sequelize.js";

/* Controller POST */
const commentController = {
  createOne: async (req, res) => {
    if (!req.body.content && !req.body.image) {
      res
        .status(400)
        .json({ error: "Le commentaire doit contenir du texte ou une image" });
    } else {
      try {
        const Comment = await comment.create({
          autor: req.auth.userId,
          content: req.body.content,
          imageUrl: req.file?.filename
            ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            : null,
        });
        res.status(200).send(Comment);
      } catch (err) {
        res.status(400).send(err);
      }
    }
  },
  updateOne: async (req, res) => {
    const commentFound = await post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (
      commentFound &&
      req.auth.userId !== commentFound.autor &&
      req.auth.role === false
    ) {
      res
        .status(401)
        .json({ message: "Vous ne pouvez pas modifier ce commentaire." });
    } else {
      if (commentFound.imageUrl && !req.body.content) {
        // Si le post de base a une image, on peut modifier et supprimer le texte
        try {
          commentFound.update({
            content: null,
          });
          res.status(200).send(commentFound);
        } catch {
          res.status(400).send(err);
        }
      } else {
        // Si le post n'a pas d'image
        try {
          commentFound.update({
            content: req.body.content,
          });
          res.status(200).send(commentFound);
        } catch {
          res.status(400).send(err);
        }
      }
    }
  },
  getAll: async (_, res) => {
    try {
      let allComments = [];
      allComments = await comment.findAll({
        order: [
          ["createdAt", "DESC"], // Du plus récent au moins récent
        ],
      });
      res.status(200).send(allComments);
    } catch {
      res.status(400);
    }
  },
  deleteOne: async (req, res) => {
    const commentFound = await comment.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (
      commentFound &&
      req.auth.userId !== commentFound.autor &&
      req.auth.role === false
    ) {
      res
        .status(401)
        .json({ message: "Vous ne pouvez pas supprimer ce commentaire." });
    } else {
      try {
        // Si le comment contenait une image
        if (commentFound.imageUrl) {
          const filename = commentFound.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            commentFound.destroy();
            res.status(200).json({ message: "Commentaire supprimé" });
          });
        } else {
          // S'il n'y avait que du texte
          commentFound.destroy();
          res.status(200).json({ message: "Comment supprimé" });
        }
      } catch (err) {
        res.status(400).send(err);
      }
    }
  },
};

export default commentController;

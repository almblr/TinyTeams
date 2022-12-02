import { comment } from "../db/sequelize.js";

/* Controller POST */
const commentController = {
  createOne: async (req, res) => {
    if (req.body.content === null && req.file === null) {
      res
        .status(400)
        .json({ message: "Votre commentaire ne peut pas être vide." });
    } else {
      try {
        if (!req.file) {
          // Si la requête ne contient pas de fichier
          const Comment = await comment.create({
            userId: req.auth.userId,
            content: req.body.content,
          });
          res.status(200).send(Comment);
        } else {
          // Si elle en contient un
          const Comment = await comment.create({
            userId: req.auth.userId,
            content: req.body.content,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          });
          res.status(200).send(Comment);
        }
      } catch (err) {
        res.status(400).send(err);
      }
    }
  },
};

export default commentController;

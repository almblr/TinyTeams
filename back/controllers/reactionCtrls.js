import { react } from "../db/sequelize.js";

/* Controller pour les likes */
const reactionController = {
  react: async (req, res) => {
    const findReact = await react.findOne({
      where: {
        userId: req.auth.userId,
        postId: req.body.postId,
      },
    });
    if (!findReact) {
      // Dans le cas où il n'y avait pas de like
      try {
        const React = await react.create({
          userId: req.auth.userId,
          postId: req.body.postId,
        });
        res.status(201).send(React);
      } catch (err) {
        res.status(400).send(err);
      }
    } else {
      // Dans le cas où il y avait un like
      if (req.auth.userId !== findReact.userId) {
        res.status(401).json({ message: "Non autorisé." });
      } else {
        if (req.body.value === findReact.value) {
          // On reclique sur like
          findReact.destroy(); //
          res.status(200).json({ message: "Réaction supprimée" });
        }
      }
    }
  },
};

export default reactionController;

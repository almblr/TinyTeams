import { react } from "../db/sequelize.js";

const reactionCtrl = {
  react: async (req, res) => {
    const reaction = await react.findOne({
      where: {
        userId: req.auth.userId,
        postId: req.params.postId,
      },
    });
    if (!reaction) {
      // Dans le cas où l'utilisateur n'a jamais liké ce post
      try {
        const newReaction = await react.create({
          userId: req.auth.userId,
          postId: req.params.postId,
        });
        res.status(201).send(newReaction);
      } catch (err) {
        res.status(400).send(err);
      }
    } else {
      // Dans le cas où il avait déjà liké
      if (req.auth.userId !== reaction.userId) {
        res.status(401).json({ message: "Non autorisé." });
      } else {
        if (req.body.value === reaction.value) {
          // On reclique sur like
          await reaction.destroy(); //
          res.status(200).json({ message: "Réaction supprimée" });
        }
      }
    }
  },
};

export default reactionCtrl;

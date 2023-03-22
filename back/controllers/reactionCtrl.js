import { react } from "../db/sequelize.js";

const reactionController = {
  react: async (req, res) => {
    const userId = req.auth.userId;
    const postId = req.params.postId;
    try {
      const reaction = await react.findOne({
        where: {
          userId,
          postId,
        },
      });
      if (!reaction) {
        // User didn't react to the post
        const newReaction = await react.create({
          userId,
          postId,
        });
        res.status(201).send(newReaction);
      } else {
        if (userId !== reaction.userId) {
          res.status(401).json({ message: "Unauthorized" });
        } else {
          if (req.body.value === reaction.value) {
            await reaction.destroy();
            res
              .status(200)
              .json({ message: "Like removed", removedLikeId: reaction.id });
          }
        }
      }
    } catch {
      res.status(500).send();
    }
  },
};

export default reactionController;

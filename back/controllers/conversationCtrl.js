import { Conversation } from "../db/sequelize.js";

const conversationCtrl = {
  create: async (req, res) => {
    try {
      const createdConversation = await Conversation.create({
        user1: req.body.user1,
        user2: req.body.user2,
      });
      res.status(201).send(createdConversation);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const allConversations = await getConvUsers.findAll({
        where: {
          user1: req.auth.userId,
        },
        order: [
          ["modifiedAt", "DESC"], // Du plus récent au moins récent
        ],
      });
      if ("lastConversationId" in req.query) {
        const lastConversation = allConversations.findIndex(
          (conv) => conv.id === parseInt(req.query.lastConversationId)
        );
        if (lastConversation === -1) {
          return res.status(400).send({ message: "Comment not found" });
        }
        const start = lastConversation + 1;
        const end = start + 15;
        const nextConvs = allConversations.slice(start, end);
        if (nextConvs.length === 0) {
          return res.status(200).send({ message: "No more convs" });
        }
        if (start + 1 === allConversations.length) {
          return res
            .status(200)
            .send(allConversations.slice(start, allConversations.length));
        }
        return res.status(200).send(nextConvs);
      }
      res.status(200).send(allConversations.slice(0, 15));
    } catch {
      res.status(500).send();
    }
  },
  update: async (req, res) => {
    const conversation = await Conversation.findByPk(req.params.conversationId);
    conversation.update({
      modifiedAt: req.body.lastMessageDate,
    });
  },
};

export default conversationCtrl;

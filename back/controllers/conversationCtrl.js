import { Conversation, Message, User } from "../db/sequelize.js";
import { Op } from "sequelize";

const conversationCtrl = {
  create: async (req, res) => {
    try {
      const createdConversation = await Conversation.create({
        user1: req.auth.userId,
        user2: req.body.user2,
      });
      const users = await User.findAll({
        where: {
          id: [createdConversation.user1, createdConversation.user2],
        },
        attributes: [
          "id",
          "firstname",
          "lastname",
          "username",
          "profilePicture",
        ],
      });
      const conversation = await Conversation.findByPk(createdConversation.id);
      conversation.setDataValue("users", users);
      res.status(201).send(conversation);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const allConversations = await Conversation.findAll({
        where: {
          [Op.or]: [{ user1: req.auth.userId }, { user2: req.auth.userId }],
        },
        order: [
          ["updatedAt", "DESC"], // Du plus récent au moins récent
        ],
      });
      const getUserInfo = async (userId) => {
        return await User.findOne({
          where: { id: userId },
          attributes: [
            "id",
            "firstname",
            "lastname",
            "username",
            "profilePicture",
          ],
        });
      };
      for (const conversation of allConversations) {
        const connectedUser =
          conversation.user1 === req.auth.userId
            ? await getUserInfo(conversation.user1)
            : await getUserInfo(conversation.user2);
        conversation.setDataValue("connectedUser", connectedUser);

        const otherUser =
          conversation.user2 !== req.auth.userId
            ? await getUserInfo(conversation.user2)
            : await getUserInfo(conversation.user1);
        conversation.setDataValue("otherUser", otherUser);

        const lastMessage = await Message.findOne({
          where: {
            conversationId: conversation.id,
          },
          order: [["createdAt", "DESC"]],
        });
        lastMessage
          ? conversation.setDataValue("lastMessage", lastMessage)
          : null;
      }
      if ("lastConversationId" in req.query) {
        const lastConversation = allConversations.findIndex(
          (conv) => conv.id === parseInt(req.query.lastConversationId)
        );
        if (lastConversation === -1) {
          return res.status(400).send({ message: "Conversation not found" });
        }
        const start = lastConversation + 1;
        const end = start + 15;
        const nextConvs = allConversations.slice(start, end);
        if (nextConvs.length === 0) {
          return res.status(200).send({ message: "No more conversations" });
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
      updatedAt: req.body.lastMessageDate,
    });
  },
};

export default conversationCtrl;

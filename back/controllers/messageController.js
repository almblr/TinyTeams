import { Message, Conversation, User } from "../db/sequelize.js";
import { Op } from "sequelize";
import fs from "fs";

const getOneUser = async (userId) => {
  return await User.findOne({
    where: { id: userId },
    attributes: ["id", "firstname", "lastname", "profilePicture"],
  });
};

/// MESSAGES CONTROLLER ///
const messageController = {
  create: async (req, res) => {
    if (
      !req.body.content &&
      Object.keys(req.files).length === 0 &&
      !req.body.imageUrl
    ) {
      return res.status(400).json({ message: "Empty message" });
    }
    try {
      const conversation = await Conversation.findByPk(
        req.params.conversationId
      );
      const createdMessage = await Message.create({
        author: req.auth.userId,
        conversationId: conversation.id,
        content: req.body.content || null,
        imageUrl: req.files.imageUrl
          ? `${req.protocol}://${req.get("host")}/images/${
              req.files.imageUrl[0].filename
            }`
          : req.body.imageUrl,
      });
      const otherUser =
        conversation.user2 !== req.auth.userId
          ? await getOneUser(conversation.user2)
          : await getOneUser(conversation.user1);
      const lastMessage = await Message.findOne({
        where: {
          conversationId: conversation.id,
        },
        order: [["createdAt", "DESC"]],
      });
      conversation.setDataValue("lastMessage", lastMessage);
      conversation.setDataValue("otherUser", otherUser);
      return res.status(201).send({ message: createdMessage, conversation });
    } catch {
      return res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const allMessages = await Message.findAll({
        where: {
          conversationId: req.params.conversationId,
        },
        order: [["createdAt", "DESC"]],
      });
      if ("lastMessageId" in req.query) {
        const lastMessage = allMessages.findIndex(
          (message) => message.id === parseInt(req.query.lastMessageId)
        );
        if (lastMessage === -1) {
          return res.status(400).send({ message: "Message not found" });
        }
        const start = lastMessage + 1;
        const end = start + 20;
        const nextMessages = allMessages.slice(start, end);
        if (nextMessages.length === 0) {
          return res.status(200).send({ message: "No more messages" });
        }
        if (start + 1 === allMessages.length) {
          return res
            .status(200)
            .send(allMessages.slice(start, allMessages.length));
        }
        return res.status(200).send(nextMessages);
      }
      res.status(200).send(allMessages.slice(0, 20));
    } catch {
      res.status(500).send();
    }
  },
  getNonRead: async (req, res) => {
    try {
      const usersConversation = await Conversation.findAll({
        where: {
          [Op.or]: [{ user1: req.auth.userId }, { user2: req.auth.userId }],
        },
      });
      const usersConversationIds = usersConversation.map(
        (conversation) => conversation.id
      );
      const unreadMessages = [];
      for (let i = 0; i < usersConversationIds.length; i++) {
        const messages = await Message.findAll({
          where: {
            conversationId: usersConversationIds[i],
            isRead: false,
            author: {
              [Op.ne]: req.auth.userId,
            },
          },
        });
        unreadMessages.push(...messages);
      }
      res.status(200).send({ unreadMessages: unreadMessages.length });
    } catch {
      res.status(500).send();
    }
  },
  update: async (req, res) => {
    try {
      const message = await Message.findByPk(req.params.messageId);
      message.update({
        isRead: true,
      });
      res.status(200).json(message);
    } catch {
      res.status(500).send();
    }
  },
  delete: async (req, res) => {
    const message = await Message.findOne({
      where: {
        conversationId: req.params.conversationId,
        messageId: req.params.messageId,
      },
    });
    if (!message || req.auth.userId !== message.author) {
      return res
        .status(401)
        .json({ message: "You cannot delete this message" });
    }
    try {
      if (message.imageUrl) {
        const filename = message.imageUrl.split("/images/")[1];
        filename ? await fs.promises.unlink(`images/${filename}`) : null;
      }
      await Message.destroy();
      res.status(200).json({ message: "Message removed" });
    } catch {
      res.status(500).send();
    }
  },
};

export default messageController;

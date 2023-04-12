import { Message } from "../db/sequelize.js";
import fs from "fs";

const messageCtrl = {
  create: async (req, res) => {
    if (
      !req.body.content &&
      Object.keys(req.files).length === 0 &&
      !req.body.imageUrl
    ) {
      return res.status(400).json({ message: "Empty message" });
    }
    try {
      const createdMessage = await Message.create({
        author: req.auth.userId,
        conversationId: parseInt(req.params.conversationId),
        content: req.body.content ? req.body.content : null,
        imageUrl: req.files?.imageUrl
          ? `${req.protocol}://${req.get("host")}/images/${
              req.files.imageUrl[0].filename
            }`
          : req.body.imageUrl,
      });
      res.status(201).send(createdMessage);
    } catch {
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    try {
      const allMessages = await Message.findAll({
        where: {
          conversationId: req.params.conversationId,
        },
        order: [
          ["createdAt", "DESC"], // Du plus récent au moins récent
        ],
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

export default messageCtrl;

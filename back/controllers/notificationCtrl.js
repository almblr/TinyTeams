import { Notification } from "../db/sequelize.js";

const notificationController = {
  create: async (req, res) => {
    try {
      const notification = await Notification.create({
        sender: req.auth.userId || req.body.sender,
        notifiableType: req.body.notifiableType,
        notifiableId: req.body.notifiableId || null,
        receiver: req.body.receiver,
        isRead: false,
      });
      res.status(201).send(notification);
    } catch {
      res.status(500).send();
    }
  },
  getOne: async (req, res) => {
    try {
      const notification = await Notification.findByPk(req.params.notifId, {});
      res.status(200).send(notification);
    } catch {
      res.status(500).send();
    }
  },
  getAll: async (req, res) => {
    console.log(req.params);
    try {
      const allNotifications = await Notification.findAll({
        where: {
          receiver: req.params.userId,
        },
        order: [
          ["createdAt", "DESC"], // Du plus récent au moins récent
        ],
      });
      // For the infinite scroll, to display nexts posts
      if ("lastNotificationId" in req.query) {
        const lastNotification = allNotifications.findIndex(
          (notification) =>
            notification.id === parseInt(req.query.lastNotificationId)
        );
        if (lastNotification === -1) {
          return res.status(400).send({ message: "Notification not found" });
        }
        const start = lastNotification + 1;
        const end = start + 10;
        const nextNotifications = allNotifications.slice(start, end);
        if (nextNotifications.length === 0) {
          return res.status(200).send({ message: "No more Notifications" });
        }
        if (start + 1 === allNotifications.length) {
          return res
            .status(200)
            .send(allNotifications.slice(start, allNotifications.length));
        }
        return res.status(200).send(nextNotifications);
      }
      res.status(200).send(allNotifications.slice(0, 10));
    } catch {
      res.status(500).send();
    }
  },
  update: async (req, res) => {
    const notification = await Notification.findByPk(req.params.notifId);
    try {
      const updatedNotification = await Notification.update({
        isRead: true,
      });
      res.status(201).send(updatedNotification);
    } catch {
      res.status(500).send();
    }
  },
  delete: async (req, res) => {
    const notification = await Notification.findByPk(req.params.notifId);
    try {
      await notification.destroy();
      res.status(200).json({ message: "Notification deleted" });
    } catch {
      res.status(500).send();
    }
  },
};

export default notificationController;

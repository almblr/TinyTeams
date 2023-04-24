import express from "express";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";
import messageController from "../controllers/messageController.js";

const router = express.Router();

router.post(
  "/:conversationId?/messages/create",
  auth,
  multerConfig,
  messageController.create
);
router.get("/:conversationId/messages/getAll", auth, messageController.getAll);
router.get("/messages/getNonRead", auth, messageController.getNonRead);
router.put(
  "/:conversationId/messages/:messageId/update",
  auth,
  messageController.update
);
router.delete(
  "/:conversationId/messages/:messageId/delete",
  auth,
  messageController.delete
);

export default router;

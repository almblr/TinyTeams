import express from "express";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";
import messageCtrl from "../controllers/messageCtrl.js";

const router = express.Router();

router.post(
  "/:conversationId?/messages/create",
  auth,
  multerConfig,
  messageCtrl.create
);
router.get("/:conversationId/messages/getAll", auth, messageCtrl.getAll);
router.get("/messages/getNonRead", auth, messageCtrl.getNonRead);
router.put(
  "/:conversationId/messages/:messageId/update",
  auth,
  messageCtrl.update
);
router.delete(
  "/:conversationId/messages/:messageId/delete",
  auth,
  messageCtrl.delete
);

export default router;

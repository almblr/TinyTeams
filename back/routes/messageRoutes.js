import express from "express";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";
import messageCtrl from "../controllers/messageCtrl.js";

const router = express.Router();

router.post(
  "/messages/:conversationId?/create",
  auth,
  multerConfig,
  messageCtrl.create
);
router.get("/messages/:conversationId/getAll", auth, messageCtrl.getAll);
router.delete(
  "/messages/:conversationId/:messageId/delete",
  auth,
  messageCtrl.delete
);

export default router;

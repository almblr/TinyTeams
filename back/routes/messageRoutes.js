import express from "express";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";
import messageCtrl from "../controllers/messageCtrl.js";

const router = express.Router();

router.post("/:conversationId/create", auth, multerConfig, messageCtrl.create);
router.get("/:conversationId/getAll", auth, messageCtrl.getAll);
router.delete("/:conversationId/:messageId/delete", auth, messageCtrl.delete);

export default router;

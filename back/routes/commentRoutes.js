import express from "express";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";
import commentCtrl from "../controllers/commentCtrl.js";

const router = express.Router();

router.post("/:postId/comments/create", auth, multerConfig, commentCtrl.create);
router.get("/:postId/comments/getAll", auth, commentCtrl.getAll);
router.put(
  "/:postId/comments/:commentId/update",
  auth,
  multerConfig,
  commentCtrl.update
);
router.delete("/:postId/comments/:commentId/delete", auth, commentCtrl.delete);

export default router;

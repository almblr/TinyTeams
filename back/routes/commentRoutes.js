import express from "express";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";
import commentController from "../controllers/commentCtrl.js";

const router = express.Router();

router.post(
  "/:postId/comments/create",
  auth,
  multerConfig,
  commentController.create
);
router.get("/:postId/comments/getAll", auth, commentController.getAll);
router.put(
  "/:postId/comments/:commentId/update",
  auth,
  multerConfig,
  commentController.update
);
router.delete(
  "/:postId/comments/:commentId/delete",
  auth,
  commentController.delete
);

export default router;

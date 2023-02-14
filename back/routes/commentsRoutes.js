import express from "express";
import commentController from "../controllers/commentsCtrl.js";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";

const router = express.Router();

router.get("/:postId/getAll", commentController.getAll);
router.post(
  "/:postId/postComment",
  auth,
  multerConfig,
  commentController.createOne
);
router.put(
  "/:postId/modify/:commentId",
  auth,
  multerConfig,
  commentController.updateOne
);
router.delete("/:postId/:commentId/delete", auth, commentController.deleteOne);

export default router;

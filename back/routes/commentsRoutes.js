import express from "express";
import commentController from "../controllers/commentsCtrl/js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:postId/getAll", commentController.getAll);
router.post("/:postId/postComment", auth, commentController.createOne);
router.put("/:postId/:commentId/modify", auth, commentController.updateOne);
router.delete("/:postId/:commentId/delete", auth, commentController.deleteOne);

export default router;

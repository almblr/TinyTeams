import express from "express";
import commentController from "../controllers/commentsCtrl/js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/getAll", commentController.getAll);
router.post("/:postId/comments", auth, commentController.createOne);
router.put("/:postId/comments", auth, commentController.updateOne);
router.delete("/:postId/comments", auth, commentController.deleteOne);

export default router;

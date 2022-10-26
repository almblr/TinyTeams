import express from "express";
import reactionController from "../controllers/reactionCtrls.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/:postId/reactions", auth, reactionController.react);

export default router;

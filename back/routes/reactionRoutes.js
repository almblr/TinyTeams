import express from "express";
import auth from "../middleware/auth.js";
import reactionController from "../controllers/reactionController.js";

const router = express.Router();

router.post("/:postId/react/", auth, reactionController.react);

export default router;

import express from "express";
import auth from "../middleware/auth.js";
import reactionController from "../controllers/reactionCtrl.js";

const router = express.Router();

router.post("/:postId/react/", auth, reactionController.react);

export default router;

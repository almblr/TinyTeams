import express from "express";
import auth from "../middleware/auth.js";
import reactionCtrl from "../controllers/reactionCtrl.js";

const router = express.Router();

router.post("/:postId/react/", auth, reactionCtrl.react);

export default router;

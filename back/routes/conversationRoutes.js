import express from "express";
import auth from "../middleware/auth.js";
import conversationCtrl from "../controllers/conversationCtrl.js";

const router = express.Router();

router.post("/create", auth, conversationCtrl.create);
router.get("/getAll", auth, conversationCtrl.getAll);

export default router;

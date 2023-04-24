import express from "express";
import auth from "../middleware/auth.js";
import conversationController from "../controllers/conversationController.js";

const router = express.Router();

router.post("/create", auth, conversationController.create);
router.get("/getOne/:conversationId", auth, conversationController.getOne);
router.get("/getAll", auth, conversationController.getAll);

export default router;

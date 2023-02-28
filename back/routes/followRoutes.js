import express from "express";
import auth from "../middleware/auth.js";
import followCtrl from "../controllers/followCtrl.js";

const router = express.Router();

router.post("/create", auth, followCtrl.create);

export default router;

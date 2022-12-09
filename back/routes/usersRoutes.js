import express from "express";
import userCtrl from "../controllers/userCtrls.js";

const router = express.Router();

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.put("/update/:id", userCtrl.update);

export default router;

import express from "express";
import userCtrl from "../controllers/userCtrls.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", userCtrl.create);
router.post("/login", userCtrl.login);
router.get("/getOne/:username", auth, userCtrl.getOne);
router.put("/update/:userId", auth, userCtrl.update);

export default router;

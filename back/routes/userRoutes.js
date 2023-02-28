import express from "express";
import auth from "../middleware/auth.js";
import userCtrl from "../controllers/userCtrl.js";

const router = express.Router();

router.post("/signup", userCtrl.create);
router.post("/login", userCtrl.login);
router.get("/getOne/:username", auth, userCtrl.getOne);
router.put("/update/:userId", auth, userCtrl.update);

export default router;

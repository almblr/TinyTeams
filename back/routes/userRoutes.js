import express from "express";
import auth from "../middleware/auth.js";
import userCtrl from "../controllers/userCtrl.js";
import multerConfig from "../middleware/multer-config.js";

const router = express.Router();

router.post("/signup", userCtrl.create);
router.post("/login", userCtrl.login);
router.get("/getOne/:userId", auth, userCtrl.getOne);
router.get("/getAll/", auth, userCtrl.getAll);
router.put("/update/:userId", auth, multerConfig, userCtrl.update);

export default router;

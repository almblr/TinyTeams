import express from "express";
import auth from "../middleware/auth.js";
import userController from "../controllers/userController.js";
import multerConfig from "../middleware/multer-config.js";

const router = express.Router();

router.post("/signup", userController.create);
router.post("/login", userController.login);
router.get("/getOne/:userId", auth, userController.getOne);
router.get("/getAll/", auth, userController.getAll);
router.put("/update/:userId", auth, multerConfig, userController.update);

export default router;

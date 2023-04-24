import express from "express";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";
import postController from "../controllers/postController.js";

const router = express.Router();

router.post("/create", auth, multerConfig, postController.create);
router.get("/getAll/", auth, postController.getAll);
router.get("/getOne/:postId", auth, postController.getOne);
router.put("/update/:postId", auth, multerConfig, postController.update);
router.delete("/delete/:postId", auth, postController.delete);

export default router;

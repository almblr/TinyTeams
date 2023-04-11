import express from "express";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";
import postCtrl from "../controllers/postCtrl.js";

const router = express.Router();

router.post("/create", auth, multerConfig, postCtrl.create);
router.get("/getAll/", auth, postCtrl.getAll);
router.get("/getOne/:postId", auth, postCtrl.getOne);
router.put("/update/:postId", auth, multerConfig, postCtrl.update);
router.delete("/delete/:postId", auth, postCtrl.delete);

export default router;

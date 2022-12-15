import express from "express";
import postController from "../controllers/postCtrls.js";
import auth from "../middleware/auth.js";
import multerConfig from "../middleware/multer-config.js";

const router = express.Router();

router.post("/createOne", auth, multerConfig, postController.createOne);
router.get("/getAll", postController.getAll);
router.get("/getOne/:id", auth, postController.getOne);
router.put("/updateOne/:id", auth, multerConfig, postController.updateOne);
router.delete("/deleteOne/:id", auth, postController.deleteOne);

export default router;

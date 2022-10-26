import express from "express";
import postController from "../controllers/postCtrls.js";
import auth from "../middleware/auth.js";
import multerconfig from "../middleware/multer-config.js";

const router = express.Router();

router.post("/createOne", auth, multerconfig, postController.createOne);
router.get("/getAll", postController.getAll);
router.get("/getOne/:id", auth, postController.getOne);
router.put("/updateOne/:id", auth, multerconfig, postController.updateOne);
router.delete("/deleteOne/:id", auth, postController.deleteOne);

export default router;

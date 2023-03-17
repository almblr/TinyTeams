import express from "express";
import auth from "../middleware/auth.js";
import followController from "../controllers/followCtrl.js";

const router = express.Router();

router.post("/follow/:userId", auth, followController.create);
router.get("/follow/getOne/:userId", auth, followController.getOne);
router.delete("/unfollow/:userId", auth, followController.delete);

export default router;

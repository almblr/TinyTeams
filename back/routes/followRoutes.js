import express from "express";
import auth from "../middleware/auth.js";
import followController from "../controllers/followCtrl.js";

const router = express.Router();

router.post("/follow/:userId", auth, followController.create);
router.get("/follow/getOne/:userId", auth, followController.getOne);
router.get("/follow/getAll/:userId", auth, followController.getAll);
router.delete("/unfollow/:followId", auth, followController.delete);

export default router;

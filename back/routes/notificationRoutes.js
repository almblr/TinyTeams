import express from "express";
import auth from "../middleware/auth.js";
import notificationController from "../controllers/notificationCtrl.js";

const router = express.Router();

router.post("/create", auth, notificationController.create);
router.get("/getOne/:userId", auth, notificationController.getOne);
router.get("getAll/:userId");
router.put(":notifId", auth, notificationController.update);
router.delete("/n:notifId", auth, notificationController.delete);

export default router;

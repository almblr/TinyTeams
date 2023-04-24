import express from "express";
import auth from "../middleware/auth.js";
import notificationController from "../controllers/notificationController.js";

const router = express.Router();

router.post("/create", auth, notificationController.create);
router.get("/getOne/:userId", auth, notificationController.getOne);
router.get("/getAll/:userId", auth, notificationController.getAll);
router.put("/update/:notifId", auth, notificationController.update);
router.put("/updateAll/:userId", auth, notificationController.updateAll);
router.delete("/:notifId", auth, notificationController.delete);

export default router;

import express from "express";
import auth from "../middleware/auth.js";
import notificationCtrl from "../controllers/notificationCtrl.js";

const router = express.Router();

router.post("/create", auth, notificationCtrl.create);
router.get("/getOne/:userId", auth, notificationCtrl.getOne);
router.get("/getAll/:userId", auth, notificationCtrl.getAll);
router.put("/update/:notifId", auth, notificationCtrl.update);
router.put("/updateAll/:userId", auth, notificationCtrl.updateAll);
router.delete("/:notifId", auth, notificationCtrl.delete);

export default router;

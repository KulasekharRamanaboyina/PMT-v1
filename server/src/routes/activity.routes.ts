import { Router } from "express";
import {
  createActivity,
  getActivities,
} from "../controllers/activity.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router({ mergeParams: true });

// 🔐 Protect all activity routes
router.use(protect);

// 📌 Get activity logs for a workspace
router.get("/", getActivities);

// 📌 Log a new activity (called internally from other controllers)
router.post("/", createActivity);

export default router;

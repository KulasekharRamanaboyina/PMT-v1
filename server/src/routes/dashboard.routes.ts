import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getDashboardStats } from "../controllers/dashboard.controller";

const router = Router();

router.get("/:workspaceId", protect, getDashboardStats);

export default router;

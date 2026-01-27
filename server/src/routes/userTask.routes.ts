import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import Task from "../models/Task"

const router = Router();

router.use(protect);

// 👤 User-centric tasks
router.get("/", async (req: any, res) => {
  const userId = req.user.id;
  const tasks = await Task.find({ assignee: userId });
  res.json(tasks);
});

export default router;
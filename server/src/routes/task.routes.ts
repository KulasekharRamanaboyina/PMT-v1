import { Router } from "express";

import { protect } from "../middlewares/auth.middleware";
import { checkWorkspaceMember } from "../middlewares/workspace.middleware";
import { checkTaskExists } from "../middlewares/task.middleware";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";

const router = Router({ mergeParams: true });

// 🔐 Auth first
router.use(protect);

// 🏢 Workspace member check
router.use(checkWorkspaceMember);

// READ & CREATE
router.get("/", getTasks);
router.post("/", createTask);

// UPDATE & DELETE
router.put("/:taskId", checkTaskExists, updateTask);
router.delete("/:taskId", checkTaskExists, deleteTask);

export default router;

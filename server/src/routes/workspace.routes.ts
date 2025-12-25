import { Router } from "express";
import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
} from "../controllers/workspace.controller";
import { protect } from "../middlewares/auth.middleware"; 
const router = Router();

// 🔐 All workspace routes require authentication
router.use(protect);

// 📌 Get all workspaces for logged-in user
router.get("/", getWorkspaces);

// 📌 Create a new workspace
router.post("/create-workspace", createWorkspace);

// 📌 Delete a workspace (only owner)
router.delete("/delete-workspace:workspaceId", deleteWorkspace);

export default router;

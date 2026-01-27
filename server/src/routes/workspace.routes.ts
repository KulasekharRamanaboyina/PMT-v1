import { Router } from "express";

import { protect } from "../middlewares/auth.middleware";
import {
  checkWorkspaceOwner,
} from "../middlewares/workspace.middleware";

import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
} from "../controllers/workspace.controller";

const router = Router();

// 🔐 Auth first
router.use(protect);

// GET & CREATE
router.get("/", getWorkspaces);
router.post("/", createWorkspace);

// DELETE (owner only)
router.delete("/:workspaceId",protect,deleteWorkspace);



export default router;

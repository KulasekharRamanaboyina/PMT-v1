import { Router } from "express";

import { protect } from "../middlewares/auth.middleware";
import {
  checkWorkspaceOwner,checkWorkspaceMember
} from "../middlewares/workspace.middleware";

import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceMembers
} from "../controllers/workspace.controller";

const router = Router();

// 🔐 Auth first
router.use(protect);

router.get(
"/:workspaceId/members",
protect,
checkWorkspaceMember,
getWorkspaceMembers
);

// GET & CREATE
router.get("/", getWorkspaces);
router.post("/", createWorkspace);

// DELETE (owner only)
router.delete("/:workspaceId",protect,deleteWorkspace);



export default router;

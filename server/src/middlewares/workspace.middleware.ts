import { Response, NextFunction } from "express";
import Workspace from "../models/Workspace";

/**
 * checkWorkspaceMember
 * --------------------
 * Allows request only if user is a member of the workspace
 */
export const checkWorkspaceMember = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      members: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "Access denied: Not a workspace member",
      });
    }

    // attach workspace if needed later
    req.workspace = workspace;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Workspace member validation failed",
    });
  }
};

/**
 * checkWorkspaceOwner
 * -------------------
 * Allows request only if user is the workspace owner
 */
export const checkWorkspaceOwner = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      owner: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "Access denied: Only owner allowed",
      });
    }

    req.workspace = workspace;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Workspace owner validation failed",
    });
  }
};

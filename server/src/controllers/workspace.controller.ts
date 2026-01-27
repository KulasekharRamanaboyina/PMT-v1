import { Request, Response } from "express";
import Workspace from "../models/Workspace";
import Task from "../models/Task";
import { logActivity } from "../middlewares/activity.middleware";


/**
 * GET WORKSPACES
 * Fetch all workspaces where user is a member
 */
export const getWorkspaces = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

 const workspaces = await Workspace.find({
  members: userId,
})
.populate({
  path: "owner",
  select: "name email avatar",
})
.populate({
  path: "members",
  select: "name email avatar",
})
.sort({ createdAt: -1 });


    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch workspaces " });
  }
};

/**
 * CREATE WORKSPACE
 */
export const createWorkspace = async (req: any, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required " });
    }

    const workspace = await Workspace.create({
      name,
      description,
      owner: userId,     
      members: [userId], 
    });
    await logActivity({
  userId,
  workspaceId: workspace._id.toString(),
  note: `Created workspace "${workspace.name}"`,
});

    res.status(201).json(workspace);
  } catch (error) {
    console.error("CREATE WORKSPACE ERROR:", error);
    res.status(500).json({ message: "Failed to create workspace " });
  }
};

/**
 * DELETE WORKSPACE
 * Only owner can delete
 */

export const deleteWorkspace = async (req: any, res: Response) => {
  try {
    const {workspaceId} = req.params;
    const userId = req.user.id;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only owner can delete this workspace ",
      });
    }
    


    await Task.deleteMany({ workspaceId });

    await logActivity({
      userId,
      workspaceId,
      note: `Deleted workspace "${workspace.name}"`,
    });

    await workspace.deleteOne();

    res.json({ message: "Workspace deleted successfully " });
  } catch (error) {
    console.error("DELETE WORKSPACE ERROR", error);
    res.status(500).json({ message: "Failed to delete workspace " });
  }
};



import { Response, NextFunction } from "express";
import Task from "../models/Task";

/**
 * checkTaskExists
 * ---------------
 * Ensures task exists inside the workspace
 */
export const checkTaskExists = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workspaceId, taskId } = req.params;

    const task = await Task.findOne({
      _id: taskId,
      workspaceId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found in this workspace ❌",
      });
    }

    // Attach task for reuse in controller if needed
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Task validation failed ❌",
    });
  }
};

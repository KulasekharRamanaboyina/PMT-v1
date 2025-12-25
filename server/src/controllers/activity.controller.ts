import { Request, Response } from "express";
import Activity from "../models/Activity";

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { taskId, note } = req.body;
    const { workspaceId } = req.params;
// create activity log
    const activity = await Activity.create({
      taskId,
      note,
      workspaceId,
      userId: req.user.id,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Failed to log activity ❌" });
  }
};

// fetch activities
export const getActivities = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    const activities = await Activity.find({ workspaceId })
      .populate("userId", "name email")
      .populate("taskId", "title status")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activities ❌" });
  }
};

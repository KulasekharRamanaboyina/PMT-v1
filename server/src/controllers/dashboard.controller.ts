import { Request, Response } from "express";
import Task from "../models/Task";

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const { workspaceId } = req.params;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const totalTasks = await Task.countDocuments({ workspaceId });

    const criticalTasks = await Task.countDocuments({
      workspaceId,
      priority: "CRITICAL",
    });

    const todoTasks = await Task.countDocuments({
      workspaceId,
      status: "TODO",
    });

    const todayTasks = await Task.countDocuments({
      workspaceId,
      dueDate: { $gte: todayStart, $lte: todayEnd },
    });

    const allTasks = await Task.find({ workspaceId });


    const tasksToday = await Task.find({
      workspaceId,
      dueDate: { $gte: todayStart, $lte: todayEnd },
    });

    const overdueTasks = await Task.find({
  workspaceId,
  dueDate: { $lt: todayStart },
  status: { $ne: "DONE" },
});

    const tomorrowStart = new Date(todayStart);
tomorrowStart.setDate(tomorrowStart.getDate() + 1);

const tomorrowEnd = new Date(tomorrowStart);
tomorrowEnd.setHours(23, 59, 59, 999);

    const tasksTomorrow = await Task.find({
  workspaceId,
  dueDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
});


    const upcomingTasks = await Task.find({
      workspaceId,
      dueDate: { $gt: new Date(todayEnd.getTime() + 24 * 60 * 60 * 1000) },
    });

    res.json({
      cards: {
        totalTasks,
        criticalTasks,
        todoTasks,
        todayTasks,
      },
      distribution: {
        today: tasksToday,
        tomorrow: tasksTomorrow,
        upcoming: upcomingTasks,
        overdue: overdueTasks,
      },allTasks
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

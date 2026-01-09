import { Request, Response } from "express";
import Task from "../models/Task";
import { logActivity } from "../middlewares/activity.middleware";

/**
 * GET TASKS (READ)
 * Fetch all tasks for a workspace
 */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    const tasks = await Task.find({ workspaceId })
      .populate("assigneeId", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks " });
  }
};

/**
 * CREATE TASK
 */
// export const createTask = async (req: Request, res: Response) => {
//   try {
//     const { workspaceId } = req.params;
//     const { title, description, status, assigneeId, dueDate } = req.body;

//     const task = await Task.create({
//       title,
//       description,
//       status: status || "TODO",
//       assigneeId,
//       dueDate,
//       workspaceId,
//       createdBy: req.user.id,
//     });
//     await logActivity({
//   userId: req.user.id,
//   workspaceId,
//   taskId: task._id.toString(),
//   note: `Created task "${task.title}"`,
// });

//     res.status(201).json(task);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create task :",error });
//   }
// };
export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description, status, priority, assigneeId, dueDate } =
      req.body;
    const { workspaceId } = req.params;

    // ✅ HARD VALIDATION
    if (!title || !priority) {
      return res.status(400).json({
        message: "Title and priority are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "TODO",
      priority, // 🔥 mandatory now
      assigneeId,
      dueDate,
      workspaceId,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task " });
  }
};

/**
 * UPDATE TASK
 */
export const updateTask = async (req: any, res: Response) => {
  try {
    const { workspaceId, taskId } = req.params;

    const {
      title,
      description,
      status,
      priority,
      assigneeId,
      dueDate,
      sourceLink,
    } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, workspaceId },
      {
        title,
        description,
        status,
        priority,
        assigneeId,
        dueDate,
        sourceLink,
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await logActivity({
      userId: req.user.id,
      workspaceId,
      taskId: task._id.toString(),
      note: `Updated task "${task.title}"`,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task ❌" });
  }
};


/**
 * DELETE TASK
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { workspaceId, taskId } = req.params;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      workspaceId,
    });
   
    if (!task) {
      return res.status(404).json({ message: "Task not found " });
    } await logActivity({
  userId: req.user.id,
  workspaceId,
  taskId: task._id.toString(),
  note: `Deleted task "${task.title}"`,
});

    res.json({ message: "Task deleted successfully " });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task " });
  }
};

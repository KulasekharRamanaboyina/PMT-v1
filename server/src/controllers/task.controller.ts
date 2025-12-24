import { Request, Response } from "express";

export const getTasks = (_req: Request, res: Response) => {
  res.json({ message: "All tasks" });
};

export const createTask = (req: Request, res: Response) => {
  res.json({
    message: "Task created",
    data: req.body,
  });
};

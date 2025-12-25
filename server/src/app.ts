import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import workspaceRoutes from "./routes/workspace.routes";
import activityRoutes from "./routes/activity.routes";

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors());
app.use(express.json());

/* ---------- Health Check ---------- */
app.get("/", (_req, res) => {
  res.json({
    status: "OK",
    service: "Nexus Project Management API",
  });
});


/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/activities", activityRoutes);

/* ---------- 404 ---------- */
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;

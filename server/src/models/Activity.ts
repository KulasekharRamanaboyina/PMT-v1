import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    note: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);

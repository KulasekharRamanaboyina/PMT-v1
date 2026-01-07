import { Schema, model, Types } from "mongoose";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      require:"true",
    },
    workspaceId: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    assigneeId: {
      type: Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);
taskSchema.index(
  { title: 1, workspaceId: 1 },
  { unique: true }
);


const Task = model("Task", taskSchema);
export default Task;

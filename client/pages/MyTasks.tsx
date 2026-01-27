import React from "react";
import { useApp } from "../context/AppContext";
import { TaskStatus } from "../types";
import { Calendar, Folder } from "lucide-react";

const MyTasks = () => {
  const { tasks, workspaces, user } = useApp();

  // only tasks assigned to logged-in user
  const myTasks = tasks.filter(
    (t) =>
      t.assigneeId &&
      (typeof t.assigneeId === "object"
        ? t.assigneeId._id === user?._id
        : t.assigneeId === user?._id)
  );

  const getWorkspaceName = (workspaceId: any) => {
    const ws = workspaces.find((w) => String(w._id) === String(workspaceId));
    return ws?.name || "Unknown Workspace";
  };

  return (
    <div className="p-8 pl-72 h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Tasks
      </h1>

      {myTasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No tasks assigned. Chill for now
        </p>
      ) : (
        <div className="space-y-4">
          {myTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center hover:shadow transition"
            >
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {task.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Folder size={14} />
                    {getWorkspaceName(task.workspaceId || task.workspace?._id)}
                  </span>

                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium
                  ${
                    task.status === TaskStatus.DONE
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : task.status === TaskStatus.IN_PROGRESS
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
              >
                {task.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;

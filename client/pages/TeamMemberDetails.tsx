import React from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Mail, Shield } from "lucide-react";

const TeamMemberDetails = () => {
  const { id } = useParams<{ id?: string }>();
  const { user, users, tasks, workspaces } = useApp();

  // 🔥 Support both self-profile & team profile
  const member = id ? users.find((u) => u.id === id) : user;

  if (!member) {
    return <div className="p-8 text-gray-400">Member not found</div>;
  }

  const assignedTasks = tasks.filter((t) => t.assigneeId === member.id);

  const memberWorkspaces = workspaces.filter(
    (ws) => ws.ownerId === member.id || ws.memberIds?.includes(member.id)
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 pl-72">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex items-center gap-6">
        <img
          src={member.avatar}
          alt={member.name}
          className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 object-cover"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {member.name}
          </h1>

          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
            <Mail size={14} />
            <span>{member.email}</span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
              <Shield size={12} />
              {member.role}
            </span>

            <span className="text-sm text-gray-400">Joined Oct 2023</span>
          </div>
        </div>
      </div>

      {/* Workspaces */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Workspaces Involved
        </h2>

        {memberWorkspaces.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No workspaces assigned.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {memberWorkspaces.map((ws) => (
              <span
                key={ws.id}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
              >
                {ws.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Tasks */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Assigned Tasks
        </h2>

        {assignedTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No tasks assigned.</p>
        ) : (
          <div className="space-y-3">
            {assignedTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberDetails;

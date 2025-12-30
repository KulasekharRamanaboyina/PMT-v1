import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { TaskStatus, Priority } from "../types";

const Dashboard = () => {
  const { tasks, users, currentWorkspace } = useApp();
  const [filterType, setFilterType] = useState<
    "TOTAL" | "IN_PROGRESS" | "PENDING" | null
  >(null);

  // Statistics
  const totalTasks = tasks.length;

  const criticalTasks = tasks.filter(
    (t) => t.priority === Priority.CRITICAL
  ).length;

  const tasksToBeDone = tasks.filter(
    (t) => t.status === TaskStatus.TODO || t.status === TaskStatus.REVIEW
  ).length;

  const today = new Date().toDateString();
  const todaysTasks = tasks.filter(
    (t) => new Date(t.dueDate).toDateString() === today
  ).length;

  const inProgressTasks = tasks.filter(
    (t) => t.status === TaskStatus.IN_PROGRESS
  ).length;

  const completedTasks = tasks.filter(
    (t) => t.status === TaskStatus.DONE
  ).length;

  // Chart Data
  const statusData = [
    {
      name: "Todo",
      value: tasks.filter((t) => t.status === TaskStatus.TODO).length,
      color: "#94a3b8",
    },
    {
      name: "In Progress",
      value: inProgressTasks,
      color: "#6366f1",
    },
    {
      name: "Review",
      value: tasks.filter((t) => t.status === TaskStatus.REVIEW).length,
      color: "#f59e0b",
    },
    {
      name: "Done",
      value: completedTasks,
      color: "#10b981",
    },
  ];

  const getFilteredTasks = () => {
    const today = new Date().toDateString();

    switch (filterType) {
      case "TOTAL":
        return tasks;

      case "CRITICAL":
        return tasks.filter((t) => t.priority === Priority.CRITICAL);

      case "PENDING":
        return tasks.filter(
          (t) => t.status === TaskStatus.TODO || t.status === TaskStatus.REVIEW
        );

      case "IN_PROGRESS":
        return tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS);

      case "TODAY": {
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        return tasks.filter((t) => {
          const dueDate = new Date(t.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          return (
            dueDate.getTime() === todayDate.getTime() &&
            t.status !== TaskStatus.DONE
          );
        });
      }

      default:
        return [];
    }
  };
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);

  const todaysTasksList = tasks.filter((t) => {
    const d = new Date(t.dueDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === todayDate.getTime() && t.status !== TaskStatus.DONE;
  });

  const tomorrowsTasksList = tasks.filter((t) => {
    const d = new Date(t.dueDate);
    d.setHours(0, 0, 0, 0);
    return (
      d.getTime() === tomorrowDate.getTime() && t.status !== TaskStatus.DONE
    );
  });

  const upcomingTasksList = tasks.filter((t) => {
    const d = new Date(t.dueDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() > tomorrowDate.getTime() && t.status !== TaskStatus.DONE;
  });

  const getFilterTitle = () => {
    switch (filterType) {
      case "TOTAL":
        return "All Tasks";
      case "CRITICAL":
        return "Critical Tasks";
      case "PENDING":
        return "Tasks To Be Done";
      case "IN_PROGRESS":
        return "In Progress Tasks";
      case "TODAY":
        return "Today's Tasks";
      default:
        return "";
    }
  };
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen pl-72 transition-colors duration-200">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Overview for{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {currentWorkspace?.name}
            </span>
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={CheckCircle2}
          label="Total Tasks"
          value={totalTasks}
          color="text-blue-600 dark:text-blue-400"
          bg="bg-blue-50 dark:bg-blue-900/20"
          onClick={() => setFilterType("TOTAL")}
        />

        <StatCard
          icon={AlertCircle}
          label="Critical Tasks"
          value={criticalTasks}
          color="text-red-600 dark:text-red-400"
          bg="bg-red-50 dark:bg-red-900/20"
          onClick={() => setFilterType("CRITICAL")}
        />

        <StatCard
          icon={Clock}
          label="Tasks To Be Done"
          value={tasksToBeDone}
          color="text-orange-600 dark:text-orange-400"
          bg="bg-orange-50 dark:bg-orange-900/20"
          onClick={() => setFilterType("PENDING")}
        />

        <StatCard
          icon={CalendarIcon}
          label="Today’s Tasks"
          value={todaysTasks}
          color="text-indigo-600 dark:text-indigo-400"
          bg="bg-indigo-50 dark:bg-indigo-900/20"
          onClick={() => setFilterType("TODAY")}
        />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white ">
          Task Distribution
        </h3>

        {/* Day-wise Task Lists */}

        {/* Today */}
        <div>
          <h4 className="text-sm font-semibold text-indigo-400 mb-3">Today</h4>

          {todaysTasksList.length === 0 ? (
            <p className="text-sm text-gray-500">No tasks for today</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {todaysTasksList.map((task) => (
                <li
                  key={task.id}
                  onClick={() => navigate("/board")}
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  {task.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="my-8 rounded-xl bg-gray-100/10 dark:bg-gray-700/30 h-0.5"></div>

        {/* Tomorrow */}
        <div>
          <h4 className="text-sm font-semibold text-yellow-400 mb-3">
            Tomorrow
          </h4>

          {tomorrowsTasksList.length === 0 ? (
            <p className="text-sm text-gray-500">No tasks for tomorrow</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {tomorrowsTasksList.map((task) => (
                <li
                  key={task.id}
                  onClick={() => navigate("/board")}
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  {task.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="my-8 rounded-xl bg-gray-100/10 dark:bg-gray-700/30 h-0.5"></div>

        {/* Upcoming */}
        <div>
          <h4 className="text-sm font-semibold text-green-400 mb-3">
            Upcoming
          </h4>

          {upcomingTasksList.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming tasks</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {upcomingTasksList.map((task) => (
                <li
                  key={task.id}
                  onClick={() => navigate("/board")}
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  {task.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      {filterType && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl shadow-2xl max-h-[80vh] flex flex-col">
            <div className="relative p-6">
              <h3 className="text-xl font-bold text-white text-center">
                {getFilterTitle()}
              </h3>
              <button
                onClick={() => setFilterType(null)}
                className="absolute right-6 top-1/2 -translate-y-1/2"
              >
                <X className="text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {getFilteredTasks().map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate("/board")}
                  className="p-4 mb-2  border-b border-gray-700 last:border-b-0 rounded-lg cursor-pointer hover:text-white transition-colors"
                >
                  <h4 className="font-semibold text-gray-400">{task.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, bg, onClick }: any) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm flex items-center justify-between cursor-pointer"
  >
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${bg}`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  </div>
);

export default Dashboard;

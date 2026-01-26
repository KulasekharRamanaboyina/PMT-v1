import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Calendar as CalendarIcon,
  User as UserIcon,
} from "lucide-react";
import { Task, TaskStatus, Priority } from "../types";

const Calendar = () => {
  const { tasks, users, addTask, updateTask, deleteTask } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days for start of grid
  const startDay = monthStart.getDay();
  const paddingDays = Array.from({ length: startDay });

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsAddModalOpen(true);
  };

  const handleTaskClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation(); // Prevent triggering day click
    setEditingTask(task);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Set time to noon to avoid timezone rolling over on simple date conversion
    const due = new Date(selectedDate);
    due.setHours(12, 0, 0, 0);

    addTask({
      title: newTaskTitle,
      description: "",
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      assigneeId: users[0].id,
      dueDate: due.toISOString(),
      tags: [],
    });
    setNewTaskTitle("");
    setIsAddModalOpen(false);
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    updateTask(editingTask.id, editingTask);
    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    if (!editingTask) return;
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(editingTask.id);
      setEditingTask(null);
    }
  };

  return (
    <div className="p-8 h-screen bg-gray-50 dark:bg-gray-900 pl-72 flex flex-col transition-colors duration-200">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calendar
        </h1>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold min-w-[140px] text-center text-gray-900 dark:text-white">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden transition-colors duration-200">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {paddingDays.map((_, i) => (
            <div
              key={`padding-${i}`}
              className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-r border-gray-100 dark:border-gray-700"
            />
          ))}

          {daysInMonth.map((day) => {
            const dayTasks = tasks.filter((t) =>
              isSameDay(new Date(t.dueDate), day)
            );
            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`min-h-[100px] border-b border-r border-gray-100 dark:border-gray-700 p-2 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  isToday(day) ? "bg-blue-50/30 dark:bg-blue-900/20" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                      isToday(day)
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-600">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={(e) => handleTaskClick(e, task)}
                      className={`text-xs p-1.5 rounded border truncate cursor-pointer hover:opacity-80 transition-all shadow-sm
                        ${
                          task.status === TaskStatus.DONE
                            ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                        }
                        `}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Add Task for {format(selectedDate, "MMM d")}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                autoFocus
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleUpdateTask}>
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Edit Task
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-800 dark:text-white bg-white dark:bg-gray-700 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={editingTask.status}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          status: e.target.value as TaskStatus,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                      {Object.values(TaskStatus).map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          priority: e.target.value as Priority,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                      {Object.values(Priority).map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assignee
                    </label>
                    <div className="relative">
                      <select
                        value={editingTask.assigneeId}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            assigneeId: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white appearance-none"
                      >
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                      <UserIcon
                        className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
                        size={16}
                      />
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={editingTask.dueDate.split("T")[0]}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            dueDate: new Date(e.target.value).toISOString(),
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
                      <CalendarIcon
                        className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
                        size={16}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={6}
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700"
                    placeholder="Add a more detailed description..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

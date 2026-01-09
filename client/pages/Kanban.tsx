import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useApp } from "../context/AppContext";
import { Task, TaskStatus, Priority } from "../types";
import {
  Plus,
  MoreHorizontal,
  Calendar as CalendarIcon,
  User as UserIcon,
  X,
  Trash2,
} from "lucide-react";

const Kanban = () => {
  // const { tasks, moveTask, users, addTask, updateTask, deleteTask } = useApp();
  const { tasks, moveTask, addTask, updateTask, deleteTask } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSourceLink, setNewTaskSourceLink] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | "">("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority | "">("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  // State for editing tasks
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const columns = [
    {
      id: TaskStatus.TODO,
      title: "To Do",
      color: "bg-gray-200 dark:bg-gray-700",
    },
    {
      id: TaskStatus.IN_PROGRESS,
      title: "In Progress",
      color: "bg-blue-200 dark:bg-blue-900",
    },
    {
      id: TaskStatus.REVIEW,
      title: "Review",
      color: "bg-yellow-200 dark:bg-yellow-900",
    },
    {
      id: TaskStatus.DONE,
      title: "Done",
      color: "bg-green-200 dark:bg-green-900",
    },
  ];

  const getTaskColorStyles = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL:
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case Priority.HIGH:
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      case Priority.MEDIUM:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case Priority.LOW:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
      default:
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === result.source.droppableId &&
      destination.index === result.source.index
    )
      return;

    moveTask(draggableId, destination.droppableId as TaskStatus);
  };

  // const handleAddTask = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newTaskTitle.trim()) return;
  //   addTask({
  //     title: newTaskTitle,
  //     description: "",
  //     status: TaskStatus.TODO,
  //     priority: Priority.MEDIUM,
  //     assigneeId: users[0].id,
  //     dueDate: new Date().toISOString(),
  //     tags: ["New"],
  //     sourceLink: newTaskSourceLink || undefined,
  //   });

  //   setNewTaskTitle("");
  //   setIsModalOpen(false);
  // };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle || !newTaskStatus || !newTaskPriority) return;

    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      status: newTaskStatus,
      priority: newTaskPriority,
      dueDate: newTaskDueDate
        ? new Date(newTaskDueDate).toISOString()
        : undefined,
      sourceLink: newTaskSourceLink || undefined,
    });

    setNewTaskTitle("");
    setNewTaskSourceLink("");
    setNewTaskDescription("");
    setNewTaskStatus("");
    setNewTaskPriority("");
    setNewTaskDueDate("");
    setIsModalOpen(false);
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    // updateTask(editingTask._id, editingTask);
    updateTask(editingTask._id, {
      title: editingTask.title,
      description: editingTask.description,
      status: editingTask.status,
      priority: editingTask.priority,
      assigneeId:
        typeof editingTask.assigneeId === "object"
          ? editingTask.assigneeId._id
          : editingTask.assigneeId,
      dueDate: editingTask.dueDate,
      sourceLink: editingTask.sourceLink,
    });

    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    if (!editingTask) return;
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(editingTask._id);
      setEditingTask(null);
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col bg-gray-50 dark:bg-gray-900 pl-72 transition-colors duration-200">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Board
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          New Task
        </button>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 h-full">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex-shrink-0 w-80 flex flex-col bg-gray-100 dark:bg-gray-800 rounded-xl max-h-full transition-colors duration-200"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${col.color
                      .replace("bg-", "bg-")
                      .replace("200", "500")
                      .replace("900", "500")}`}
                  ></div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                    {col.title}
                  </h3>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium">
                    {tasks.filter((t) => t.status === col.id).length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 p-3 overflow-y-auto custom-scrollbar transition-colors min-h-[200px] ${
                      snapshot.isDraggingOver
                        ? "bg-gray-200/50 dark:bg-gray-700/50"
                        : ""
                    }`}
                  >
                    {tasks
                      .filter((t) => t.status === col.id)
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setEditingTask(task)}
                              className={`${getTaskColorStyles(
                                task.priority
                              )} p-4 rounded-lg shadow-sm mb-3 border group hover:shadow-md transition-all cursor-pointer ${
                                snapshot.isDragging
                                  ? "shadow-lg rotate-2 ring-2 ring-indigo-500"
                                  : ""
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                    ${
                                      task.priority === Priority.CRITICAL
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                        : task.priority === Priority.HIGH
                                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
                                        : task.priority === Priority.MEDIUM
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 leading-snug">
                                {task.title}
                              </h4>
                              {/* task link */}
                              {task.sourceLink && (
                                <a
                                  href={task.sourceLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs text-indigo-500 hover:underline"
                                >
                                  Open source →
                                </a>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon size={12} />
                                    <span>
                                      {new Date(
                                        task.dueDate
                                      ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                {task.assigneeId && (
                                  <div
                                    className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden border border-white dark:border-gray-500 ring-1 ring-gray-100 dark:ring-gray-600"
                                    title="Assigned"
                                  >
                                    {/* <img
                                      src={
                                        users.find(
                                          (u) =>
                                            u.id ===
                                            (typeof task.assigneeId === "object"
                                              ? task.assigneeId._id
                                              : task.assigneeId)
                                        )?.avatar
                                      }
                                      alt="Avatar"
                                      className="w-full h-full object-cover"
                                    /> */}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white text-center">
              Add New Task
            </h3>
            <form onSubmit={handleAddTask}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task title
              </label>
              <input
                type="text"
                autoFocus
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                placeholder="Description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task priority
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Priority</option>
                {Object.values(Priority).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due date
              </label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task status
              </label>
              <select
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Status</option>
                {Object.values(TaskStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source Link
                </label>
                <input
                  type="url"
                  placeholder="https://github.com"
                  value={newTaskSourceLink}
                  onChange={(e) => setNewTaskSourceLink(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                        value={
                          typeof editingTask.assigneeId === "object"
                            ? editingTask.assigneeId._id
                            : editingTask.assigneeId
                        }
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            assigneeId: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white appearance-none"
                      >
                        {/* {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))} */}
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
                        value={
                          editingTask.dueDate
                            ? editingTask.dueDate.split("T")[0]
                            : ""
                        }
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
                {/* Source Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Source Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com"
                    value={editingTask.sourceLink || ""}
                    // onChange={(e) =>
                    //   setEditingTask({
                    //     ...editingTask,
                    //     sourceLink: e.target.value,
                    //   })
                    // }
                    onChange={(e) => {
                      let value = e.target.value;

                      if (
                        value &&
                        !value.startsWith("http://") &&
                        !value.startsWith("https://")
                      ) {
                        value = "https://" + value;
                      }

                      setEditingTask({
                        ...editingTask,
                        sourceLink: value,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
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

export default Kanban;

import { useApp } from "../context/AppContext";

const MyDashboard = () => {
  const { user, allTasks } = useApp();

  if (!user) return null;

  const myTasks = allTasks.filter((t) => {
    if (!t.assigneeId || !user) return false;

    const assignee =
      typeof t.assigneeId === "object" ? t.assigneeId._id : t.assigneeId;

    return String(assignee) === String(user._id);
  });

  const today = new Date().toDateString();

  const dueToday = myTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate).toDateString() === today,
  );

  const completed = myTasks.filter((t) => t.status === "DONE");
  console.log("ALL TASKS:", allTasks.length);
  console.log(
    "CURRENT WS TASKS:",
    allTasks.filter(
      (t) => String(t.workspaceId) === String(currentWorkspace?._id),
    ).length,
  );

  return (
    <div className="p-8 pl-72 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">My Tasks</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {myTasks.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">
            Due Today
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {dueToday.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">
            Completed
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {completed.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyDashboard;

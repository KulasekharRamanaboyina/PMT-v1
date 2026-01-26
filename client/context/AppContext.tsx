import api from "../services/api";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Workspace, Task, ActivityLog, TaskStatus } from "../types";

interface AppContextType {
  user: User | null;
  token: string | null;
  users: User[];
  setAuth: (user: User, token: string) => void;
  logout: () => void;

  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  tasks: Task[];
  activities: ActivityLog[];

  setCurrentWorkspace: (ws: Workspace | null) => void;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;

  addTask: (task: Omit<Task, "id" | "workspaceId">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;

  createWorkspace: (name: string, description?: string) => void;
  deleteWorkspace: (id: string) => void;
  addMember: (name: string, email: string, role: "ADMIN" | "MEMBER") => void;

  logActivity: (action: string, details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [users, setUsers] = useState<User[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    () => {
      const stored = localStorage.getItem("currentWorkspace");
      return stored ? JSON.parse(stored) : null;
    },
  );
  const [myTasks, setMyTasks] = useState<Task[]>([]);

  //  FIX: store ALL tasks
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  // console.log("SAMPLE TASK:", allTasks[0]);

  const [activities, setActivities] = useState<ActivityLog[]>([]);

  const setAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWorkspaces([]);
    setCurrentWorkspace(null);
    setAllTasks([]);
    localStorage.removeItem("token");
  };

  const login = async () => false;
  const signup = async () => false;

  // add or create task
  const addTask = async (task: Omit<Task, "id" | "workspaceId">) => {
    try {
      if (!currentWorkspace) return;

      const res = await api.post(`/workspaces/${currentWorkspace._id}/tasks`, {
        ...task,
        workspaceId: currentWorkspace._id,
      });

      // add new task to state
      setAllTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Add task failed", err);
    }
  };
  // update task
  // const updateTask = async (id: string, updates: Partial<Task>) => {
  //   try {
  //     const res = await api.patch(`/tasks/${id}`, updates);
  //     setAllTasks((prev) =>
  //       prev.map((t) => (String(t._id) === String(id) ? res.data : t))
  //     );
  //   } catch (err) {
  //     console.error("Update task failed", err);
  //   }
  // };
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      if (!currentWorkspace) return;

      const res = await api.put(
        `/workspaces/${currentWorkspace._id}/tasks/${id}`,
        updates,
      );

      setAllTasks((prev) =>
        prev.map((t) => (String(t._id) === String(id) ? res.data : t)),
      );
    } catch (err) {
      console.error("Update task failed", err);
    }
  };

  // move Task
  // const moveTask = async (id: string, status: TaskStatus) => {
  //   try {
  //     // optimistic UI
  //     setAllTasks((prev) =>
  //       prev.map((t) => (String(t._id) === String(id) ? { ...t, status } : t))
  //     );
  //     // backend persist
  //     await api.patch(`/tasks/${id}`, { status });
  //   } catch (err) {
  //     console.error("Move task failed", err);
  //   }
  // };
  const moveTask = async (id: string, status: TaskStatus) => {
    try {
      if (!currentWorkspace) return;

      // optimistic UI
      setAllTasks((prev) =>
        prev.map((t) => (String(t._id) === String(id) ? { ...t, status } : t)),
      );

      // backend persist
      await api.put(`/workspaces/${currentWorkspace._id}/tasks/${id}`, {
        status,
      });
    } catch (err) {
      console.error("Move task failed", err);
    }
  };

  // delete task
  const deleteTask = async (id: string) => {
    try {
      if (!currentWorkspace) return;

      await api.delete(`/workspaces/${currentWorkspace._id}/tasks/${id}`);

      setAllTasks((prev) => prev.filter((t) => String(t._id) !== String(id)));
    } catch (err) {
      console.error("Delete task failed", err);
    }
  };

  const createWorkspace = async (name: string, description?: string) => {
    try {
      const res = await api.post("/workspaces", { name, description });
      const newWorkspace = res.data;

      setWorkspaces((prev) => [...prev, newWorkspace]);
      setCurrentWorkspace(newWorkspace);
      localStorage.setItem("currentWorkspace", JSON.stringify(newWorkspace));
    } catch (err) {
      console.error("Create workspace failed", err);
    }
  };

  const deleteWorkspace = async (id: string) => {
    console.log("Deleting workspace:", id);
    try {
      // await api.delete(`/workspaces/${currentWorkspace?._id || id}`);
      await api.delete(`/workspaces/${id}`);

      setWorkspaces((prev) => prev.filter((w) => w._id !== id));

      if (currentWorkspace?._id === id) {
        setCurrentWorkspace(null);
        setAllTasks([]);
        localStorage.removeItem("currentWorkspace");
      }
    } catch (err) {
      console.error("Delete workspace failed", err);
    }
  };

  const addMember = () => {};
  const logActivity = () => {};
  // log Activity
  // useEffect(() => {
  //   if (!token || !currentWorkspace) return;

  //   const fetchActivities = async () => {
  //     try {
  //       const res = await api.get(
  //         `/workspaces/${currentWorkspace._id}/activities`
  //       );
  //       setActivities(res.data);
  //     } catch (err) {
  //       console.error("Fetch activities failed", err);
  //     }
  //   };

  //   fetchActivities();
  // }, [token, currentWorkspace]);
  // ✅ FETCH ALL TASKS (for MyDashboard)
  useEffect(() => {
    if (!token) return;

    const fetchAllTasks = async () => {
      try {
        const res = await api.get("/tasks"); // 👈 ALL tasks
        setAllTasks(res.data);
        console.log("ALL TASKS LOADED:", res.data.length);
      } catch (err) {
        console.error("Fetch all tasks failed", err);
      }
    };

    fetchAllTasks();
  }, [token]);

  // 🔹 FETCH WORKSPACES
  useEffect(() => {
    if (!token) return;

    const fetchWorkspaces = async () => {
      try {
        const res = await api.get("/workspaces");
        setWorkspaces([...res.data].reverse());

        if (res.data.length > 0 && !currentWorkspace) {
          setCurrentWorkspace(res.data[0]);
        }
      } catch (err) {
        console.error("Fetch workspaces failed", err);
      }
    };

    fetchWorkspaces();
  }, [token, currentWorkspace]);

  //  FETCH ALL TASKS (NO workspace filter)
  useEffect(() => {
    if (!token || !currentWorkspace) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get(`/workspaces/${currentWorkspace._id}/tasks`);
        setAllTasks(res.data);
      } catch (err) {
        console.error("Fetch tasks failed", err);
      }
    };

    fetchTasks();
  }, [token, currentWorkspace]);
  console.log("ALL TASKS LENGTH:", allTasks.length);
  // Fetch all users
  useEffect(() => {
    if (!token || !currentWorkspace) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get(
          `/workspaces/${currentWorkspace._id}/members`,
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Fetch users failed", err);
      }
    };

    fetchUsers();
  }, [token, currentWorkspace]);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        users,
        setAuth,
        logout,
        workspaces,
        currentWorkspace,
        allTasks,
        tasks: currentWorkspace
          ? allTasks.filter(
              (t) =>
                String(t.workspaceId || t.workspace?._id) ===
                String(currentWorkspace._id),
            )
          : [],

        activities,
        setCurrentWorkspace: (ws) => {
          setCurrentWorkspace(ws);
          if (ws) {
            localStorage.setItem("currentWorkspace", JSON.stringify(ws));
          } else {
            localStorage.removeItem("currentWorkspace");
          }
        },

        login,
        signup,
        addTask,
        updateTask,
        moveTask,
        deleteTask,
        createWorkspace,
        deleteWorkspace,
        addMember,
        logActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};

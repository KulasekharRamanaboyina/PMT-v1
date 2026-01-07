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
    localStorage.getItem("token")
  );

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    () => {
      const stored = localStorage.getItem("currentWorkspace");
      return stored ? JSON.parse(stored) : null;
    }
  );

  //  FIX: store ALL tasks
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const [activities] = useState<ActivityLog[]>([]);

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

  const addTask = () => {};
  const updateTask = () => {};
  const moveTask = () => {};
  const deleteTask = () => {};

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
      await api.delete(`/workspaces/${currentWorkspace?._id || id}`);

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

  // 🔹 FETCH WORKSPACES
  useEffect(() => {
    if (!token) return;

    const fetchWorkspaces = async () => {
      try {
        const res = await api.get("/workspaces");
        setWorkspaces(res.data);

        if (res.data.length > 0 && !currentWorkspace) {
          setCurrentWorkspace(res.data[0]);
        }
      } catch (err) {
        console.error("Fetch workspaces failed", err);
      }
    };

    fetchWorkspaces();
  }, [token]);

  // 🔹 FETCH ALL TASKS (NO workspace filter)
  useEffect(() => {
    if (!token) return;

    const fetchAllTasks = async () => {
      try {
        const res = await api.get(`/tasks/${currentWorkspace._id}`);
        setAllTasks(res.data.tasks);
      } catch (err) {
        console.error("Fetch tasks failed", err);
      }
    };

    fetchAllTasks();
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        setAuth,
        logout,
        workspaces,
        currentWorkspace,

        //  FIX: workspace-wise derived tasks
        tasks: currentWorkspace
          ? allTasks.filter(
              (t) => String(t.workspaceId) === String(currentWorkspace._id)
            )
          : [],

        activities,
        // setCurrentWorkspace,
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

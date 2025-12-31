// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import {
//   Task,
//   User,
//   ActivityLog,
//   MOCK_USERS,
//   INITIAL_TASKS,
//   INITIAL_WORKSPACES,
//   TaskStatus,
//   Workspace,
// } from "../types";
// import { v4 as uuidv4 } from "uuid";
// import { db } from "../services/db";

// interface AppContextType {
//   user: User | null;
//   users: User[];
//   workspaces: Workspace[];
//   currentWorkspace: Workspace | null;
//   tasks: Task[];
//   activities: ActivityLog[];

//   login: (email: string, password: string) => boolean;
//   signup: (name: string, email: string, password: string) => boolean;
//   logout: () => void;

//   setCurrentWorkspace: (workspace: Workspace) => void;
//   createWorkspace: (name: string, description?: string) => void;
//   deleteWorkspace: (id: string) => void;

//   addTask: (task: Omit<Task, "id" | "workspaceId">) => void;
//   updateTask: (id: string, updates: Partial<Task>) => void;
//   moveTask: (taskId: string, newStatus: TaskStatus) => void;
//   deleteTask: (id: string) => void;

//   addMember: (name: string, email: string, role: "ADMIN" | "MEMBER") => void;

//   logActivity: (action: string, details: string) => void; // ✅ FIX
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(() => db.getSession());
//   const [users, setUsers] = useState<User[]>(() => {
//     const existing = db.getUsers();
//     if (existing.length === 0) {
//       MOCK_USERS.forEach((u) => db.saveUser(u));
//       return MOCK_USERS;
//     }
//     return existing;
//   });

//   const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
//     const existing = db.getWorkspaces();
//     if (existing.length === 0) {
//       INITIAL_WORKSPACES.forEach((w) => db.saveWorkspace(w));
//       return INITIAL_WORKSPACES;
//     }
//     return existing;
//   });

//   const [currentWorkspace, setCurrentWorkspaceState] =
//     useState<Workspace | null>(() => {
//       const saved = db.getCurrentWs();
//       const all = db.getWorkspaces();
//       return saved && all.find((w: any) => w.id === saved.id)
//         ? saved
//         : all[0] || null;
//     });

//   const [allTasks, setAllTasks] = useState<Task[]>(() => {
//     const existing = db.getAllTasks();
//     if (existing.length === 0) {
//       INITIAL_TASKS.forEach((t) => db.saveTask(t));
//       return INITIAL_TASKS;
//     }
//     return existing;
//   });

//   const [activities, setActivities] = useState<ActivityLog[]>([]);

//   useEffect(() => {
//     db.setSession(user);
//   }, [user]);

//   useEffect(() => {
//     db.setCurrentWs(currentWorkspace);
//   }, [currentWorkspace]);

//   // ✅ CENTRAL LOGGER
//   const logActivity = (action: string, details: string) => {
//     if (!user) return;

//     const newActivity: ActivityLog = {
//       id: uuidv4(),
//       userId: user.id,
//       action,
//       details,
//       timestamp: new Date().toISOString(),
//     };

//     setActivities((prev) => [newActivity, ...prev]);
//   };

//   const login = (email: string) => {
//     const foundUser = db.findUserByEmail(email);
//     if (!foundUser) return false;

//     setUser(foundUser);
//     logActivity("Login", `${foundUser.name} logged in`);
//     return true;
//   };

//   const signup = (name: string, email: string) => {
//     if (db.findUserByEmail(email)) return false;

//     const id = uuidv4();
//     const newUser: User = {
//       id,
//       name,
//       email,
//       role: "ADMIN",
//       avatar: `https://ui-avatars.com/api/?name=${name}`,
//     };

//     const ws: Workspace = {
//       id: uuidv4(),
//       name: `${name}'s Projects`,
//       description: `Workspace for ${name}`,
//       ownerId: id,
//       memberIds: [id],
//       createdAt: new Date().toISOString(),
//     };

//     db.saveUser(newUser);
//     db.saveWorkspace(ws);

//     setUser(newUser);
//     setUsers(db.getUsers());
//     setWorkspaces(db.getWorkspaces());
//     setCurrentWorkspaceState(ws);

//     logActivity("Signup", `${name} created an account`);
//     return true;
//   };

//   const logout = () => {
//     logActivity("Logout", `${user?.name} logged out`);
//     setUser(null);
//     db.clearSession();
//   };

//   const tasks = allTasks.filter((t) => t.workspaceId === currentWorkspace?.id);

//   const addTask = (taskData: Omit<Task, "id" | "workspaceId">) => {
//     if (!currentWorkspace) return;

//     const task: Task = {
//       ...taskData,
//       id: uuidv4(),
//       workspaceId: currentWorkspace.id,
//     };

//     db.saveTask(task);
//     setAllTasks(db.getAllTasks());

//     logActivity("Task Created", `"${task.title}" was added`);
//   };

//   const updateTask = (id: string, updates: Partial<Task>) => {
//     const task = allTasks.find((t) => t.id === id);
//     if (!task) return;

//     db.saveTask({ ...task, ...updates });
//     setAllTasks(db.getAllTasks());

//     logActivity("Task Updated", `"${task.title}" was edited`);
//   };

//   const moveTask = (taskId: string, newStatus: TaskStatus) => {
//     const task = allTasks.find((t) => t.id === taskId);
//     if (!task) return;

//     db.saveTask({ ...task, status: newStatus });
//     setAllTasks(db.getAllTasks());

//     logActivity("Task Status Changed", `"${task.title}" → ${newStatus}`);
//   };

//   const deleteTask = (id: string) => {
//     const task = allTasks.find((t) => t.id === id);
//     db.deleteTask(id);
//     setAllTasks(db.getAllTasks());

//     if (task) {
//       logActivity("Task Deleted", `"${task.title}" was removed`);
//     }
//   };

//   const addMember = (name: string, email: string, role: "ADMIN" | "MEMBER") => {
//     const user: User = {
//       id: uuidv4(),
//       name,
//       email,
//       role,
//       avatar: `https://ui-avatars.com/api/?name=${name}`,
//     };

//     db.saveUser(user);
//     setUsers(db.getUsers());

//     logActivity("Member Added", `${name} joined as ${role}`);
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         user,
//         users,
//         workspaces,
//         currentWorkspace,
//         tasks,
//         activities,
//         login,
//         signup,
//         logout,
//         setCurrentWorkspace: setCurrentWorkspaceState,
//         createWorkspace: () => {},
//         deleteWorkspace: () => {},
//         addTask,
//         updateTask,
//         moveTask,
//         deleteTask,
//         addMember,
//         logActivity,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const ctx = useContext(AppContext);
//   if (!ctx) throw new Error("useApp must be used inside AppProvider");
//   return ctx;
// };

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, Workspace, Task, ActivityLog, TaskStatus } from "../types";

interface AppContextType {
  user: User | null;
  token: string | null;

  // AUTH
  setAuth: (user: User, token: string) => void;
  logout: () => void;

  // PLACEHOLDERS (UI won’t break)
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // UI-safe placeholders
  const [workspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [tasks] = useState<Task[]>([]);
  const [activities] = useState<ActivityLog[]>([]);

  // ✅ Used by Auth.tsx
  const setAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // 🔌 These will be wired later (UI won’t crash)
  const login = async () => false;
  const signup = async () => false;

  const addTask = () => {};
  const updateTask = () => {};
  const moveTask = () => {};
  const deleteTask = () => {};

  const createWorkspace = () => {};
  const deleteWorkspace = () => {};
  const addMember = () => {};
  const logActivity = () => {};

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        setAuth,
        logout,
        workspaces,
        currentWorkspace,
        tasks,
        activities,
        setCurrentWorkspace,
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

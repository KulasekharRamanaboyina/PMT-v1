
/**
 * Nexus Local Database Service
 * Uses localStorage to persist data across sessions, mimicking a real database.
 */

const DB_PREFIX = 'nexus_v2_';

const KEYS = {
  USERS: `${DB_PREFIX}users`,
  TASKS: `${DB_PREFIX}tasks`,
  WORKSPACES: `${DB_PREFIX}workspaces`,
  SESSION: `${DB_PREFIX}session`,
  CURRENT_WS: `${DB_PREFIX}current_ws`
};

export const db = {
  // --- USERS ---
  getUsers: (): any[] => {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  
  saveUser: (user: any) => {
    const users = db.getUsers();
    const idx = users.findIndex((u: any) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx > -1) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return user;
  },

  findUserByEmail: (email: string) => {
    if (!email) return null;
    const users = db.getUsers();
    return users.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  // --- WORKSPACES ---
  getWorkspaces: (): any[] => {
    try {
      const data = localStorage.getItem(KEYS.WORKSPACES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveWorkspace: (ws: any) => {
    const wss = db.getWorkspaces();
    const idx = wss.findIndex((w: any) => w.id === ws.id);
    if (idx > -1) {
      wss[idx] = { ...wss[idx], ...ws };
    } else {
      wss.push(ws);
    }
    localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(wss));
    return ws;
  },

  deleteWorkspace: (id: string) => {
    const wss = db.getWorkspaces().filter((w: any) => w.id !== id);
    localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(wss));
    
    // Cascading delete for tasks
    const tasks = db.getAllTasks().filter((t: any) => t.workspaceId !== id);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  // --- TASKS ---
  getAllTasks: (): any[] => {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveTask: (task: any) => {
    const tasks = db.getAllTasks();
    const idx = tasks.findIndex((t: any) => t.id === task.id);
    if (idx > -1) {
      tasks[idx] = { ...tasks[idx], ...task };
    } else {
      tasks.push(task);
    }
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    return task;
  },

  deleteTask: (id: string) => {
    const tasks = db.getAllTasks().filter((t: any) => t.id !== id);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  // --- SESSION ---
  setSession: (user: any) => {
    if (user) {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.SESSION);
    }
  },

  getSession: () => {
    try {
      const session = localStorage.getItem(KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem(KEYS.SESSION);
    localStorage.removeItem(KEYS.CURRENT_WS);
  },

  // --- CURRENT WORKSPACE ---
  setCurrentWs: (ws: any) => {
    if (ws) {
      localStorage.setItem(KEYS.CURRENT_WS, JSON.stringify(ws));
    } else {
      localStorage.removeItem(KEYS.CURRENT_WS);
    }
  },

  getCurrentWs: () => {
    try {
      const ws = localStorage.getItem(KEYS.CURRENT_WS);
      return ws ? JSON.parse(ws) : null;
    } catch (e) {
      return null;
    }
  }
};

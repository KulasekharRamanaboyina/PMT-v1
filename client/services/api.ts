import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers?.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);



/* ================= AUTH APIs ================= */

export const login = (data: any) => {
  return api.post("/auth/login", data);
};

export const signup = (data: any) => {
  return api.post("/auth/register", data);
};
/* =================  DASHBOARD ================  */

export const getDashboardData = (workspaceId: string) => {
  return api.get(`/dashboard/${workspaceId}`);
};
export default api;


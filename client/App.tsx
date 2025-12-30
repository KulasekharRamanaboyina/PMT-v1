import React from "react";
import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import Auth from "./pages/Auth";
import TeamMemberDetails from "./pages/TeamMemberDetails";
// Activity placeholder
const ActivityView = () => {
  const { activities } = useApp();
  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 pl-72 transition-colors duration-200">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Activity Log
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No activity yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {activities.map((log) => (
              <div
                key={log.id}
                className="p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-sm text-gray-400 dark:text-gray-500 w-32 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    {log.action}
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProtectedLayout = () => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

// Fixed: Making children optional to satisfy TypeScript's strict prop checking in some environments
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useApp();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/board" element={<Kanban />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/team" element={<Team />} />
        <Route path="/activity" element={<ActivityView />} />
        <Route path="/profile" element={<TeamMemberDetails isSelf />} />
        <Route path="/team/:id" element={<TeamMemberDetails />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;

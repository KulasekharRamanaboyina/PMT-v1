import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Kanban,
  Calendar,
  Users,
  LogOut,
  Activity,
  Briefcase,
  Plus,
  ChevronDown,
  Trash2,
  Info,
  X,
  Clock,
  ShieldCheck,
  Camera,
  Upload, // Added Upload icon
  Image as ImageIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Workspace } from "../types";
import MyDashboard from "@/pages/MyDashboard";
import { Label } from "recharts";

const Sidebar = () => {
  const navigate = useNavigate();
  const {
    user,
    users,
    logout,
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    createWorkspace,
    deleteWorkspace,
    updateProfileImage,
  } = useApp();

  // Sidebar States
  const [isWsOpen, setIsWsOpen] = useState(false);

  // Workspace Creation States
  const [isCreatingWs, setIsCreatingWs] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsDesc, setNewWsDesc] = useState("");

  // Workspace Info Modal State
  const [selectedWsInfo, setSelectedWsInfo] = useState<Workspace | null>(null);

  // --- Profile Update States ---
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Delete workspace Popup states
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [wsToDelete, setWsToDelete] = useState<Workspace | null>(null);
  // Show workspace info State
  const [showWsInfoPopup, setShowWsInfoPopup] = useState(false);
  const [wsInfo, setWsInfo] = useState<Workspace | null>(null);

  const navItems = [
    // { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: ListTodo, label: "MyDashboard", path: "/tasks" },
    { icon: Kanban, label: "Board", path: "/board" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Users, label: "Team", path: "/team" },
    { icon: Activity, label: "Activity", path: "/activity" },
  ];

  const activeClass =
    "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 transition-all shadow-sm";
  const inactiveClass =
    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all";

  // --- Handlers ---

  const handleCreateWs = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWsName.trim()) {
      createWorkspace(newWsName, newWsDesc);
      setNewWsName("");
      setNewWsDesc("");
      setIsCreatingWs(false);
    }
  };

  const handleDeleteWs = (e: React.MouseEvent, ws: Workspace) => {
    e.stopPropagation();
    setWsToDelete(ws);
    setShowDeletePopup(true);
  };

  const handleWsClick = (ws: Workspace) => {
    setCurrentWorkspace(ws);
    setIsWsOpen(false);
    navigate("/workspace");
  };

  // Open Modal and reset preview to current user avatar
  const handleProfileClick = () => {
    setPreviewUrl(user?.avatar || "");
    setIsProfileModalOpen(true);
  };

  // Handle File Selection from Explorer
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // This converts the image to a Base64 string so it can be previewed and saved
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger the hidden file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (previewUrl) {
      updateProfileImage(previewUrl);
      setIsProfileModalOpen(false);
    }
  };

  // --- Helpers ---

  const getOwnerName = (ownerId: string) =>
    users.find((u) => u.id === ownerId)?.name || "Nexus Admin";

  const getMemberNames = (memberIds: string[]) => {
    if (!memberIds || memberIds.length === 0) return "No active members";
    return memberIds
      .map((id) => users.find((u) => u.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen fixed left-0 top-0 z-30 shadow-xl transition-all">
      {/* Header / Workspace Switcher */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <span className="text-white font-black text-xl">N</span>
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Nexus
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="relative">
          <button
            onClick={() => setIsWsOpen(!isWsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-bold text-gray-800 dark:text-white hover:border-indigo-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2 truncate">
              <Briefcase size={16} className="text-indigo-600" />
              <span className="truncate">
                {currentWorkspace?.name || "Switch Workspace"}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                isWsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isWsOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="max-h-64 overflow-y-auto p-1 custom-scrollbar">
                {workspaces.map((ws) => (
                  <div
                    key={ws._id}
                    onClick={() => handleWsClick(ws)}
                    className={`group flex items-center justify-between px-3 py-3 text-sm rounded-xl cursor-pointer mb-1 transition-all ${
                      currentWorkspace?._id === ws._id
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="truncate font-bold pr-2">{ws.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setWsInfo(ws);
                          setShowWsInfoPopup(true);
                          setIsWsOpen(false);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          currentWorkspace?.id === ws.id
                            ? "hover:bg-white/20"
                            : "hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                        title="Details"
                      >
                        <Info size={14} />
                      </button>
                      {user?.role === "ADMIN" && workspaces.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteWs(e, ws)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            currentWorkspace?.id === ws.id
                              ? "hover:bg-red-500"
                              : "hover:bg-red-50 text-red-500"
                          }`}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setIsCreatingWs(true);
                  setIsWsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-4 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border-t border-gray-100 dark:border-gray-700"
              >
                <Plus size={14} />
                New Workspace
              </button>
            </div>
          )}
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 p-2 mb-4 rounded-lg transition relative group">
          {/* Avatar with Overlay */}
          <div
            onClick={handleProfileClick}
            className="relative w-10 h-10 cursor-pointer shrink-0"
            title="Click to update profile picture"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm object-cover"
            />
            {/* Hover overlay icon */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={14} className="text-white" />
            </div>
          </div>

          {/* User Info */}
          <div
            onClick={() => navigate("/profile")}
            className="flex-1 min-w-0 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-tighter">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-black text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-95"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Workspace Info Modal */}
      {selectedWsInfo && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-lg shadow-3xl border border-gray-200 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                  {selectedWsInfo.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {selectedWsInfo.description ||
                    "A collaborative space for project execution and tracking."}
                </p>
              </div>
              <button
                onClick={() => setSelectedWsInfo(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {/* Owner Info */}
              <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-4 border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <ShieldCheck className="text-indigo-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">
                    Owner
                  </span>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {getOwnerName(selectedWsInfo.ownerId)}
                  </p>
                </div>
              </div>
              {/* Created Date */}
              <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-4 border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <Clock className="text-orange-500" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">
                    Created
                  </span>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {new Date(selectedWsInfo.createdAt).toLocaleDateString(
                      undefined,
                      { dateStyle: "long" },
                    )}
                  </p>
                </div>
              </div>
              {/* Collaborators */}
              <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-4 border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <Users className="text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">
                    Collaborators
                  </span>
                  <p className="font-bold text-gray-900 dark:text-white leading-tight">
                    {getMemberNames(selectedWsInfo.memberIds)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {user?.role === "ADMIN" && workspaces.length > 1 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 mb-2">
                  <button
                    onClick={(e) => handleDeleteWs(e, selectedWsInfo)}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200 dark:shadow-none"
                  >
                    <Trash2 size={16} />
                    Delete Workspace
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedWsInfo(null)}
                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Workspace Creation Modal */}
      {isCreatingWs && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-3xl">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              Forge New Space
            </h3>
            <form onSubmit={handleCreateWs} className="space-y-5">
              <input
                autoFocus
                required
                placeholder="Space Name"
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-gray-900 dark:text-white"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
              />
              <textarea
                placeholder="What's this space for?"
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-medium h-32 resize-none text-gray-800 dark:text-gray-200"
                value={newWsDesc}
                onChange={(e) => setNewWsDesc(e.target.value)}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingWs(false)}
                  className="flex-1 py-4 font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700"
                >
                  Create Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. UPDATED: File Upload Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                Update Profile Picture
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateAvatar} className="space-y-6">
              {/* Image Preview & Upload Trigger */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full border-4 border-indigo-100 dark:border-gray-700 shadow-md overflow-hidden bg-gray-100 relative group">
                  <img
                    src={previewUrl || "https://via.placeholder.com/150"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                {/* Custom Upload Button */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-900/50"
                >
                  <Upload size={18} />
                  Choose Image
                </button>

                <p className="text-xs text-gray-400 font-medium text-center px-4">
                  Supports JPG, PNG and WEBP. Image is saved locally.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 py-4 font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-colors"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete workspace popup */}
      {showDeletePopup && wsToDelete && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Workspace
            </h3>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-blue-500">
                {wsToDelete.name}
              </span>
              ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setWsToDelete(null);
                }}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteWorkspace(wsToDelete._id);
                  setShowDeletePopup(false);
                  setWsToDelete(null);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/*Workspace Info popup  */}
      {showWsInfoPopup && wsInfo && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#1f2937] rounded-3xl p-8 w-full max-w-md shadow-3xl text-white">
            {/* Workspace Name */}
            <h3 className="text-2xl font-black mb-4">{wsInfo.name}</h3>

            {/*  Description — ONLY if exists */}
            {wsInfo.description?.trim() && (
              <p className="text-gray-300 mb-6 leading-relaxed">
                {wsInfo.description}
              </p>
            )}

            {/* Info */}
            <div className="space-y-3 text-sm">
              {/* Owner name */}
              <p>
                <span className="text-gray-400">Owner:</span>{" "}
                <span className="font-semibold text-white">
                  {wsInfo.owner?.name}
                </span>
              </p>

              {/* Member names */}
              <p>
                <span className=" text-gray-400">Members:</span>{" "}
                <span className="font-semibold text-white">
                  {wsInfo.members
                    ?.map((m: any) => m.name)
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </p>

              {/* Created date */}
              <p>
                <span className=" text-gray-400">Created on:</span>{" "}
                <span className="font-semibold text-white">
                  {new Date(wsInfo.createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => setShowWsInfoPopup(false)}
              className="mt-8 w-full py-3 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

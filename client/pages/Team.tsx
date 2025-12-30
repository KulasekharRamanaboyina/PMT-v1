// import React, { useState } from "react";
// import { useApp } from "../context/AppContext";
// import { useNavigate } from "react-router-dom";
// import { Mail, Shield, User as UserIcon, Plus, X } from "lucide-react";

// const navigate = useNavigate();

// const Team = () => {
//   const { users, user: currentUser, addMember } = useApp();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newMember, setNewMember] = useState({
//     name: "",
//     email: "",
//     role: "MEMBER" as "ADMIN" | "MEMBER",
//   });

//   const handleInvite = (e: React.FormEvent) => {
//     e.preventDefault();
//     addMember(newMember.name, newMember.email, newMember.role);
//     setNewMember({ name: "", email: "", role: "MEMBER" });
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 pl-72 transition-colors duration-200">
//       <header className="mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Team Members
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400">
//             Manage your team and their permissions.
//           </p>
//         </div>
//         {currentUser?.role === "ADMIN" && (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             <Plus size={18} />
//             Invite Member
//           </button>
//         )}
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {users.map((user) => (
//           <div
//             key={user.id}
//             className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-colors duration-200"
//           >
//             <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
//             <div className="px-6 relative flex-1 flex flex-col">
//               <div className="-mt-10 mb-4">
//                 <img
//                   src={user.avatar}
//                   alt={user.name}
//                   className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover"
//                 />
//               </div>

//               <div className="mb-4">
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">
//                   {user.name}
//                 </h3>
//                 <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
//                   <Mail size={14} />
//                   <span>{user.email}</span>
//                 </div>
//               </div>

//               <div className="mt-auto mb-6 flex gap-2">
//                 <span
//                   className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
//                     user.role === "ADMIN"
//                       ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   }`}
//                 >
//                   <Shield size={12} />
//                   {user.role}
//                 </span>
//               </div>
//             </div>
//             <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
//               <span>Joined Oct 2023</span>
//               <button
//                 onClick={() => navigate(`/profile/${user.id}`)}
//                 className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
//               >
//                 View Profile
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Invite Member Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-bold text-gray-900 dark:text-white">
//                 Invite Team Member
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleInvite} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   required
//                   type="text"
//                   value={newMember.name}
//                   onChange={(e) =>
//                     setNewMember({ ...newMember, name: e.target.value })
//                   }
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Email Address
//                 </label>
//                 <input
//                   required
//                   type="email"
//                   value={newMember.email}
//                   onChange={(e) =>
//                     setNewMember({ ...newMember, email: e.target.value })
//                   }
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Role
//                 </label>
//                 <select
//                   value={newMember.role}
//                   onChange={(e) =>
//                     setNewMember({ ...newMember, role: e.target.value as any })
//                   }
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
//                 >
//                   <option value="MEMBER">Member</option>
//                   <option value="ADMIN">Admin</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                 >
//                   Send Invite
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Team;

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Mail, Shield, Plus, X } from "lucide-react";

const Team = () => {
  const { users, user: currentUser, addMember } = useApp();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "MEMBER" as "ADMIN" | "MEMBER",
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    addMember(newMember.name, newMember.email, newMember.role);
    setNewMember({ name: "", email: "", role: "MEMBER" });
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 pl-72 transition-colors duration-200">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Team Members
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your team and their permissions.
          </p>
        </div>

        {currentUser?.role === "ADMIN" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            Invite Member
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
          >
            <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

            <div className="px-6 relative flex-1 flex flex-col">
              <div className="-mt-10 mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover"
                />
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="mt-auto mb-6">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Shield size={12} />
                  {user.role}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Joined Oct 2023</span>
              <button
                onClick={() => navigate(`/team/${user.id}`)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Invite Team Member
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      role: e.target.value as "ADMIN" | "MEMBER",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;

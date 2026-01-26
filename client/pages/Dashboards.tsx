// import React, { useState } from 'react';
// import { useApp } from '../context/AppContext';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import { CheckCircle2, Clock, AlertCircle, TrendingUp, X, Calendar as CalendarIcon } from 'lucide-react';
// import { TaskStatus, Priority } from '../types';

// const Dashboard = () => {
//   const { tasks, users, currentWorkspace } = useApp();
//   const [filterType, setFilterType] = useState<'TOTAL' | 'PROGRESS' | 'IN_PROGRESS' | 'PENDING' | null>(null);

//   // Statistics
//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
//   const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
//   const pendingTasks = totalTasks - completedTasks - inProgressTasks;
//   const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

//   // Chart Data (Static Light/Neutral theme since toggler is removed)
//   const statusData = [
//     { name: 'Todo', value: tasks.filter(t => t.status === TaskStatus.TODO).length, color: '#94a3b8' },
//     { name: 'In Progress', value: inProgressTasks, color: '#6366f1' },
//     { name: 'Review', value: tasks.filter(t => t.status === TaskStatus.REVIEW).length, color: '#f59e0b' },
//     { name: 'Done', value: completedTasks, color: '#10b981' },
//   ];

//   const getFilteredTasks = () => {
//       switch(filterType) {
//           case 'TOTAL': return tasks;
//           case 'PROGRESS': return tasks.filter(t => t.status === TaskStatus.DONE);
//           case 'IN_PROGRESS': return tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
//           case 'PENDING': return tasks.filter(t => t.status === TaskStatus.TODO || t.status === TaskStatus.REVIEW);
//           default: return [];
//       }
//   };

//   const getFilterTitle = () => {
//       switch(filterType) {
//           case 'TOTAL': return 'All Tasks';
//           case 'PROGRESS': return 'Completed Tasks';
//           case 'IN_PROGRESS': return 'In Progress Tasks';
//           case 'PENDING': return 'Pending Tasks';
//           default: return '';
//       }
//   };

//   return (
//     <div className="p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen pl-72 transition-colors duration-200">
//       <header className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
//           <p className="text-gray-500 dark:text-gray-400">Overview for <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentWorkspace?.name}</span></p>
//         </div>
//       </header>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <StatCard
//             icon={CheckCircle2}
//             label="Total Tasks"
//             value={totalTasks}
//             color="text-blue-600 dark:text-blue-400"
//             bg="bg-blue-50 dark:bg-blue-900/20"
//             onClick={() => setFilterType('TOTAL')}
//         />
//         <StatCard
//             icon={TrendingUp}
//             label="Progress"
//             value={`${progress}%`}
//             color="text-green-600 dark:text-green-400"
//             bg="bg-green-50 dark:bg-green-900/20"
//             onClick={() => setFilterType('PROGRESS')}
//         />
//         <StatCard
//             icon={Clock}
//             label="In Progress"
//             value={inProgressTasks}
//             color="text-indigo-600 dark:text-indigo-400"
//             bg="bg-indigo-50 dark:bg-indigo-900/20"
//             onClick={() => setFilterType('IN_PROGRESS')}
//         />
//         <StatCard
//             icon={AlertCircle}
//             label="Pending"
//             value={pendingTasks}
//             color="text-orange-600 dark:text-orange-400"
//             bg="bg-orange-50 dark:bg-orange-900/20"
//             onClick={() => setFilterType('PENDING')}
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-8">
//         {/* Main Chart */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
//           <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Task Distribution</h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={statusData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
//                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
//                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
//                 <Tooltip
//                     cursor={{fill: 'transparent'}}
//                     contentStyle={{
//                         borderRadius: '8px',
//                         border: 'none',
//                         boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
//                         backgroundColor: '#fff',
//                         color: '#000'
//                     }}
//                 />
//                 <Bar dataKey="value" radius={[4, 4, 0, 0]}>
//                   {statusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Task List Modal */}
//       {filterType && (
//           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
//               <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl shadow-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
//                   <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
//                       <h3 className="text-xl font-bold text-gray-900 dark:text-white">{getFilterTitle()}</h3>
//                       <button
//                         onClick={() => setFilterType(null)}
//                         className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                       >
//                           <X size={20} />
//                       </button>
//                   </div>
//                   <div className="p-6 overflow-y-auto custom-scrollbar">
//                       {getFilteredTasks().length === 0 ? (
//                           <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//                               No tasks found for this category.
//                           </div>
//                       ) : (
//                           <div className="space-y-3">
//                               {getFilteredTasks().map(task => (
//                                   <div key={task.id} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm">
//                                       <div className="flex-1 min-w-0">
//                                           <div className="flex items-center gap-2 mb-1">
//                                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
//                                                 ${task.priority === Priority.CRITICAL ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
//                                                 task.priority === Priority.HIGH ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
//                                                 task.priority === Priority.MEDIUM ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
//                                                 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
//                                                 }`}>
//                                                 {task.priority}
//                                             </span>
//                                             <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
//                                             <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{task.status.replace('_', ' ')}</span>
//                                           </div>
//                                           <h4 className="font-semibold text-gray-900 dark:text-white truncate">{task.title}</h4>
//                                       </div>
//                                       <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 shrink-0">
//                                           <div className="flex items-center gap-1.5">
//                                               <CalendarIcon size={14} />
//                                               <span>{new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
//                                           </div>
//                                           {task.assigneeId && (
//                                             <div className="flex items-center gap-2" title="Assignee">
//                                                  <img
//                                                     src={users.find(u => u.id === task.assigneeId)?.avatar}
//                                                     alt="Avatar"
//                                                     className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-600"
//                                                 />
//                                             </div>
//                                           )}
//                                       </div>
//                                   </div>
//                               ))}
//                           </div>
//                       )}
//                   </div>
//                   <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl flex justify-end">
//                       <button
//                         onClick={() => setFilterType(null)}
//                         className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium text-sm shadow-sm"
//                       >
//                           Close
//                       </button>
//                   </div>
//               </div>
//           </div>
//       )}
//     </div>
//   );
// };

// const StatCard = ({ icon: Icon, label, value, color, bg, onClick }: any) => (
//   <div
//     onClick={onClick}
//     className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between transition-all hover:shadow-md cursor-pointer group hover:border-indigo-200 dark:hover:border-indigo-800"
//   >
//     <div>
//       <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{label}</p>
//       <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
//     </div>
//     <div className={`p-3 rounded-lg ${bg} group-hover:scale-110 transition-transform`}>
//       <Icon className={`w-6 h-6 ${color}`} />
//     </div>
//   </div>
// );

// export default Dashboards;

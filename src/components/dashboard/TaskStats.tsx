"use client";

import React from "react";

interface Task {
  id: string;
  status: string;
}

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {/* Total Tasks (Blue) */}
      <div className="bg-[#2b56ad] border border-transparent p-5 rounded text-white shadow-sm">
        <p className="text-xs font-semibold opacity-90">Total Tasks</p>
        <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{total}</h3>
        <p className="text-[10px] opacity-75 mt-1">Tasks in workspace</p>
      </div>

      {/* Pending Tasks (Red) */}
      <div className="bg-[#a83232] border border-transparent p-5 rounded text-white shadow-sm">
        <p className="text-xs font-semibold opacity-90">Pending Tasks</p>
        <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{pending}</h3>
        <p className="text-[10px] opacity-75 mt-1">Awaiting action</p>
      </div>

      {/* Completed Tasks (Green) */}
      <div className="bg-[#3b8a3b] border border-transparent p-5 rounded text-white shadow-sm">
        <p className="text-xs font-semibold opacity-90">Completed Tasks</p>
        <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{completed}</h3>
        <p className="text-[10px] opacity-75 mt-1">Tasks resolved</p>
      </div>

      {/* Workspace Progress */}
      <div className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-[#232528] p-5 rounded shadow-sm text-slate-800 dark:text-white">
        <div className="flex justify-between items-baseline">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Workspace Progress</p>
          <span className="text-xs font-extrabold">{completionRate}%</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{completed} of {total} completed</p>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded mt-2.5 overflow-hidden">
          <div
            className="bg-[#2b56ad] dark:bg-[#3b82f6] h-full rounded transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";

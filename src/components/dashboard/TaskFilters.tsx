"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/Input";

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
}

export function TaskFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: TaskFiltersProps) {
  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-[#15161e]"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-2 flex-shrink-0">
            Priority:
          </span>
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriorityFilter(opt.value)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors flex-shrink-0 ${
                priorityFilter === opt.value
                  ? "bg-slate-800 dark:bg-slate-200 border-slate-850 dark:border-slate-200 text-white dark:text-slate-900"
                  : "bg-white dark:bg-[#15161e] border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-bold border-b-2 transition-all -mb-px ${
              statusFilter === opt.value
                ? "border-slate-800 dark:border-slate-200 text-slate-900 dark:text-slate-100"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";

"use client";

import React, { useState } from "react";
import { Calendar, Paperclip, ExternalLink, Edit, Trash, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { formatDate } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  dueDate: string;
  status: string;
  fileUrl: string | null;
  externalLink: string | null;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await onStatusChange(task.id, newStatus);
    setIsUpdating(false);
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30";
      case "medium":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30";
      case "low":
      default:
        return "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/50";
    }
  };

  const getDaysRemaining = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: "Due today", className: "text-amber-600 dark:text-amber-500 font-semibold" };
    } else if (diffDays === 1) {
      return { text: "Due tomorrow", className: "text-slate-700 dark:text-slate-300 font-semibold" };
    } else if (diffDays > 1) {
      return { text: `${diffDays} days left`, className: "text-slate-500 dark:text-slate-400 font-normal" };
    } else {
      return { text: `${Math.abs(diffDays)} days overdue`, className: "text-rose-600 dark:text-rose-400 font-semibold" };
    }
  };

  const isCompleted = task.status === "completed";
  const daysInfo = isCompleted
    ? { text: "Completed", className: "text-emerald-600 dark:text-emerald-400 font-semibold" }
    : getDaysRemaining(task.dueDate);

  return (
    <div
      className={`bg-white dark:bg-[#161822] border border-slate-250 dark:border-slate-800 p-5 rounded flex flex-col justify-between transition-opacity duration-150 ${
        isCompleted ? "opacity-60 bg-slate-50/50 dark:bg-slate-900/10" : ""
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getPriorityBadgeClass(task.priority)}`}>
            {task.priority}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => onEdit(task)}
              disabled={isUpdating}
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => onDelete(task.id)}
              disabled={isUpdating}
            >
              <Trash className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Title & Checkbox */}
        <div className="flex gap-3 items-start">
          <button
            onClick={handleToggle}
            disabled={isUpdating}
            className={`flex-shrink-0 mt-1 w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors duration-150 ${
              isCompleted
                ? "bg-slate-800 border-slate-800 dark:bg-slate-200 dark:border-slate-200 text-white dark:text-slate-900"
                : "border-slate-300 dark:border-slate-700 hover:border-slate-600 dark:hover:border-slate-400"
            }`}
          >
            {isUpdating ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            ) : (
              isCompleted && <Check className="w-3 h-3 stroke-[3px]" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h4
              className={`font-semibold text-sm text-slate-950 dark:text-white leading-snug truncate ${
                isCompleted ? "line-through text-slate-400 dark:text-slate-600" : ""
              }`}
            >
              {task.title}
            </h4>
            {task.description && (
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 text-[11px] select-none">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(task.dueDate)}</span>
          <span className="mx-1.5 text-slate-200 dark:text-slate-800">•</span>
          <span className={daysInfo.className}>{daysInfo.text}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {task.fileUrl && (
            <a
              href={task.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              title="View Attachment"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </a>
          )}
          {task.externalLink && (
            <a
              href={task.externalLink.startsWith("http") ? task.externalLink : `https://${task.externalLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              title="Open Link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";

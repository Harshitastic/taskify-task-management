"use client";

import React, { useEffect, useState, useRef } from "react";
import { Upload, Paperclip, Check, Loader2, Link as LinkIcon } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface Task {
  id?: string;
  title: string;
  description: string | null;
  priority: string;
  dueDate: string;
  status?: string;
  fileUrl: string | null;
  externalLink: string | null;
}

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => Promise<void>;
  task?: Task | null;
}

export function TaskFormModal({ isOpen, onClose, onSubmit, task }: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [externalLink, setExternalLink] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      const dateObj = new Date(task.dueDate);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      setDueDate(`${yyyy}-${mm}-${dd}`);
      setFileUrl(task.fileUrl);
      setExternalLink(task.externalLink || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("low");
      setDueDate("");
      setFileUrl(null);
      setExternalLink("");
    }
    setError(null);
  }, [task, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "File upload failed.");
      }

      setFileUrl(data.fileUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!title || !priority || !dueDate) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        title,
        description: description || null,
        priority,
        dueDate: new Date(dueDate).toISOString(),
        fileUrl,
        externalLink: externalLink || null,
        status: task?.status || "pending",
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "Create New Task"}
      size="md"
    >
      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Task Title *"
          placeholder="e.g. Design Landing Page"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Description (Optional)
          </label>
          <textarea
            placeholder="Describe the goals and key steps of this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#10121b] text-[#172b4d] dark:text-[#deebff] border border-[#dfe1e6] dark:border-[#2a2e3d] rounded focus:outline-none focus:ring-2 focus:ring-[#0052cc]/40 dark:focus:ring-[#0065ff]/40 focus:border-[#0052cc] dark:focus:border-[#0065ff] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
          />
        </div>

        {/* Priority & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Priority *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#10121b] text-[#172b4d] dark:text-[#deebff] border border-[#dfe1e6] dark:border-[#2a2e3d] rounded focus:outline-none focus:ring-2 focus:ring-[#0052cc]/40 dark:focus:ring-[#0065ff]/40 focus:border-[#0052cc] dark:focus:border-[#0065ff] transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#10121b] text-[#172b4d] dark:text-[#deebff] border border-[#dfe1e6] dark:border-[#2a2e3d] rounded focus:outline-none focus:ring-2 focus:ring-[#0052cc]/40 dark:focus:ring-[#0065ff]/40 focus:border-[#0052cc] dark:focus:border-[#0065ff] transition-all"
            />
          </div>
        </div>

        {/* External Link */}
        <div className="relative">
          <Input
            label="External Link (Optional)"
            placeholder="e.g. github.com/project"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
          />
          <LinkIcon className="absolute right-3 top-[32px] w-4 h-4 text-slate-500" />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            File Attachment (Optional)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 border-[#dfe1e6] dark:border-[#2a2e3d]"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isSubmitting}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>

            {fileUrl && (
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                <span>Uploaded</span>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-emerald-400 transition-colors flex items-center ml-1"
                >
                  <Paperclip className="w-3 h-3 mr-0.5" /> View
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900/50 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={isUploading}>
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Plus, ListTodo } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { TaskStats } from "@/components/dashboard/TaskStats";
import { TaskFilters } from "@/components/dashboard/TaskFilters";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { TaskFormModal } from "@/components/dashboard/TaskFormModal";
import { Spinner } from "@/components/ui/Spinner";

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

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Member");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const firstName = parsed.name ? parsed.name.split(" ")[0] : "Member";
        setUserName(firstName);
      } catch (e) {}
    }
  }, []);

  const handleCreateOrUpdateTask = async (taskData: any) => {
    try {
      let res;
      if (activeTask) {
        res = await fetch(`/api/tasks/${activeTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
      } else {
        res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save task.");
      }

      await fetchTasks();
      setIsFormOpen(false);
      setActiveTask(null);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: updatedTask.status } : t))
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const openCreateModal = () => {
    setActiveTask(null);
    setIsFormOpen(true);
  };

  const openEditModal = (task: Task) => {
    setActiveTask(task);
    setIsFormOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = tasks.filter((t) => t.status !== "completed").length;

  const getWelcomeMessage = () => {
    if (pendingCount === 0) {
      return "All caught up! No tasks pending today. 🎉";
    }
    if (pendingCount === 1) {
      return "You have 1 task pending today. You've got this!";
    }
    return `You have ${pendingCount} tasks pending today. Let's make progress!`;
  };

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0e12] text-slate-850 dark:text-slate-200 flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Hi, {userName}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1.5 font-medium">
              {getWelcomeMessage()}
            </p>
          </div>
          <Button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Add Task</span>
          </Button>
        </div>

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Filter Toolbar */}
        <div className="flat-card p-5">
          <TaskFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />
        </div>

        {/* Tasks View */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Spinner />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flat-card py-16 px-6 text-center flex flex-col items-center justify-center border-dashed">
            <div className="bg-[#ebecf0] dark:bg-[#161822] p-4 rounded text-slate-500 mb-4 border border-slate-200 dark:border-slate-800">
              <ListTodo className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">No tasks found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mt-1.5 leading-relaxed">
              {searchQuery || priorityFilter !== "all" || statusFilter !== "all"
                ? "We couldn't find any tasks matching your filters. Try adjusting your search query."
                : "Your workspace is empty! Click 'Add Task' to create your first task and start tracking your goals."}
            </p>
            {!searchQuery && priorityFilter === "all" && statusFilter === "all" && (
              <Button onClick={openCreateModal} variant="outline" className="mt-6 text-xs py-2">
                Create First Task
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Task Creation/Editing Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        task={activeTask}
      />
    </div>
  );
}
export const dynamic = "force-dynamic";

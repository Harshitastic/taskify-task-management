"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, Loader2, ListTodo } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";

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

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Date State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
  }, []);

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
      console.error("Failed to update task status:", error);
    }
  };

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);

  const calendarCells = [];

  // Previous month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true,
    });
  }

  // Next month padding days to fill 42 cells grid (6 rows)
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTasksForDate = (y: number, m: number, d: number) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === y &&
        taskDate.getMonth() === m &&
        taskDate.getDate() === d
      );
    });
  };

  const selectedDateTasks = getTasksForDate(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-rose-500";
      case "medium":
        return "bg-amber-500";
      case "low":
      default:
        return "bg-emerald-500";
    }
  };

  const getPriorityTextClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-rose-950/20 text-rose-400 border border-rose-900/30";
      case "medium":
        return "bg-amber-950/20 text-amber-400 border border-amber-900/30";
      case "low":
      default:
        return "bg-slate-800/40 text-slate-400 border border-slate-800/50";
    }
  };

  const isToday = (y: number, m: number, d: number) => {
    const today = new Date();
    return today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
  };

  const isSelected = (y: number, m: number, d: number) => {
    return (
      selectedDate.getFullYear() === y &&
      selectedDate.getMonth() === m &&
      selectedDate.getDate() === d
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0e12] text-slate-850 dark:text-slate-200 flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Task Calendar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Track and manage your project deadlines month-by-month
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#2b56ad] dark:text-[#3b82f6]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Monthly Calendar */}
            <div className="flat-card p-5 lg:col-span-2 flex flex-col justify-between bg-white dark:bg-[#15161e] border-slate-200 dark:border-slate-800">
              {/* Calendar Controls */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white select-none">
                  {monthNames[month]} {year}
                </h3>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-1.5 rounded"
                    onClick={prevMonth}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2.5 font-bold"
                    onClick={() => {
                      setCurrentDate(new Date());
                      setSelectedDate(new Date());
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-1.5 rounded"
                    onClick={nextMonth}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Weekdays Header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {daysOfWeek.map((day) => (
                  <span
                    key={day}
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 flex-grow">
                {calendarCells.map((cell, idx) => {
                  const dayTasks = getTasksForDate(cell.year, cell.month, cell.day);
                  const cellIsToday = isToday(cell.year, cell.month, cell.day);
                  const cellIsSelected = isSelected(cell.year, cell.month, cell.day);

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(new Date(cell.year, cell.month, cell.day))}
                      className={`relative min-h-[70px] sm:min-h-[85px] p-1.5 rounded border text-left flex flex-col justify-between transition-all group ${
                        cell.isCurrentMonth
                          ? "bg-white dark:bg-[#15161e] text-slate-800 dark:text-slate-100"
                          : "bg-slate-50/50 dark:bg-slate-900/10 text-slate-400 dark:text-slate-650"
                      } ${
                        cellIsSelected
                          ? "border-[#2b56ad] dark:border-[#3b82f6] ring-2 ring-[#2b56ad]/20 dark:ring-[#3b82f6]/20 z-10"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-500"
                      }`}
                    >
                      {/* Day Number */}
                      <span
                        className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full select-none ${
                          cellIsToday
                            ? "bg-[#2b56ad] dark:bg-[#3b82f6] text-white"
                            : "text-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {cell.day}
                      </span>

                      {/* Task indicators inside cell */}
                      <div className="w-full mt-1.5 flex flex-col gap-0.5 overflow-hidden">
                        {/* Desktop: Tiny card indicators */}
                        <div className="hidden sm:flex flex-col gap-0.5 w-full">
                          {dayTasks.slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className={`text-[9px] px-1.5 py-0.5 rounded truncate font-semibold border ${
                                task.status === "completed"
                                  ? "line-through opacity-40 bg-slate-100 dark:bg-slate-900 text-slate-500 border-transparent"
                                  : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <span className="text-[8px] font-bold text-slate-500 ml-1.5">
                              +{dayTasks.length - 2} more
                            </span>
                          )}
                        </div>

                        {/* Mobile: Colored dot indicators */}
                        <div className="flex sm:hidden gap-1 mt-auto">
                          {dayTasks.map((t) => (
                            <span
                              key={t.id}
                              className={`w-1.5 h-1.5 rounded-full ${
                                t.status === "completed" ? "bg-emerald-400 opacity-40" : getPriorityColor(t.priority)
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Date Tasks Details Panel */}
            <div className="flat-card p-5 flex flex-col justify-between h-fit bg-white dark:bg-[#15161e] border-slate-200 dark:border-slate-800">
              <div>
                {/* Header */}
                <div className="pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Selected Date
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1 select-none">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </h4>
                </div>

                {/* Selected Date Tasks List */}
                <div className="space-y-3">
                  {selectedDateTasks.length === 0 ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center">
                      <div className="bg-slate-50 dark:bg-[#0d0e12] p-3 rounded text-slate-500 mb-3 border border-slate-200 dark:border-slate-800">
                        <ListTodo className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">No tasks due today</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[200px] mt-1 leading-normal">
                        No task schedules match this day. Enjoy your free time!
                      </p>
                    </div>
                  ) : (
                    selectedDateTasks.map((task) => {
                      const isCompleted = task.status === "completed";
                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex gap-3 items-start transition-all ${
                            isCompleted ? "opacity-60 bg-slate-950/10" : ""
                          }`}
                        >
                          {/* Complete status checkbox */}
                          <button
                            onClick={() => handleStatusChange(task.id, isCompleted ? "pending" : "completed")}
                            className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              isCompleted
                                ? "bg-slate-700 border-slate-700 text-white"
                                : "border-slate-300 dark:border-slate-700 hover:border-slate-500"
                            }`}
                          >
                            {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h5
                              className={`font-semibold text-xs text-slate-850 dark:text-white leading-snug truncate ${
                                isCompleted ? "line-through text-slate-400" : ""
                              }`}
                            >
                              {task.title}
                            </h5>
                            
                            <div className="flex items-center gap-1.5 mt-2">
                              <span
                                className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getPriorityTextClass(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
export const dynamic = "force-dynamic";

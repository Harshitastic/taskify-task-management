"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, User, LogOut, ChevronDown, CheckSquare } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Member");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        const pending = data.filter((t: any) => t.status !== "completed").length;
        setPendingCount(pending);
      }
    } catch (e) {}
  };

  const syncUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name);
        setProfilePic(parsed.profilePic || null);
      } catch (e) {}
    }
  };

  useEffect(() => {
    syncUser();
    fetchPendingCount();

    window.addEventListener("profileUpdate", syncUser);
    return () => {
      window.removeEventListener("profileUpdate", syncUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Mock projects list from image
  const mockProjects = [
    { name: "Smart B&B", count: 3 },
    { name: "E-commerce", count: 1 },
    { name: "Order food", count: 0 },
    { name: "Shared Chargers", count: 1 },
    { name: "Business Matching", count: 2 },
    { name: "Jumpserver", count: 0 }
  ];

  return (
    <aside className="w-64 bg-[#18191c] border-r border-[#232528] text-[#9b9c9e] h-screen flex flex-col justify-between flex-shrink-0 select-none hidden md:flex">
      <div>
        {/* Profile Section */}
        <div className="p-4 border-b border-[#232528] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-[#232528]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shadow-inner">
                {userName[0].toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">{userName}</span>
              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Active
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[#9b9c9e] cursor-pointer" />
        </div>

        {/* Brand */}
        <div className="px-4 py-3.5 flex items-center gap-2 text-white border-b border-[#232528]/50">
          <CheckSquare className="w-4.5 h-4.5 text-[#3b82f6]" />
          <span className="font-extrabold text-sm tracking-tight">TaskFlow Space</span>
        </div>

        {/* Menu Section */}
        <nav className="p-3 space-y-1">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center justify-between px-3 py-2 rounded text-sm font-semibold transition-colors ${
              pathname === "/dashboard"
                ? "bg-[#2c2f35] text-white"
                : "hover:bg-[#202225] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>

          {/* Calendar */}
          <Link
            href="/calendar"
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-semibold transition-colors ${
              pathname === "/calendar"
                ? "bg-[#2c2f35] text-white"
                : "hover:bg-[#202225] hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-semibold transition-colors ${
              pathname === "/profile"
                ? "bg-[#2c2f35] text-white"
                : "hover:bg-[#202225] hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </nav>

        {/* Projects Section */}
        <div className="px-3 mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-3">Projects</p>
          <div className="space-y-0.5">
            {mockProjects.map((proj, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#202225] hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                  <span>{proj.name}</span>
                </div>
                {proj.count > 0 && (
                  <span className="text-[10px] text-slate-500 font-bold">{proj.count}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout button at bottom */}
      <div className="p-3 border-t border-[#232528]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm font-semibold hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-slate-400 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Layers, Moon, Sun, LayoutDashboard, Calendar } from "lucide-react";
import { Button } from "./ui/Button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

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
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);

    syncUser();

    window.addEventListener("profileUpdate", syncUser);
    return () => {
      window.removeEventListener("profileUpdate", syncUser);
    };
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

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

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white dark:bg-[#0d0e12] border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 sm:px-6 flex items-center justify-between shadow-sm select-none">
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-slate-800 dark:bg-slate-200 p-1.5 rounded text-white dark:text-slate-900 shadow-sm transition-colors">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
              Taskify
            </span>
          </Link>

          {/* Links - Hidden on Mobile, Visible on Tablet/Desktop */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-colors ${
                pathname.startsWith("/dashboard")
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/calendar"
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-colors ${
                pathname.startsWith("/calendar")
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              Calendar
            </Link>
            <Link
              href="/profile"
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-colors ${
                pathname.startsWith("/profile")
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              Profile
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50"
            title="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-500" />
            )}
          </Button>

          {/* User Info & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/profile" className="flex items-center gap-1.5 sm:gap-2 group">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-7 h-7 sm:w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 h-8 rounded bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold shadow-inner">
                  {userName ? userName[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                </div>
              )}
              {userName && (
                <span className="hidden md:inline text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-350 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                  {userName}
                </span>
              )}
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/10"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Bottom Nav Bar for Mobile Viewports (hides on sm: tablet/desktop screens) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0d0e12] border-t border-slate-200 dark:border-slate-800 py-2.5 px-6 flex items-center justify-around z-40 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            pathname.startsWith("/dashboard")
              ? "text-[#2563eb] dark:text-[#3b82f6]"
              : "text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/calendar"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            pathname.startsWith("/calendar")
              ? "text-[#2563eb] dark:text-[#3b82f6]"
              : "text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            pathname.startsWith("/profile")
              ? "text-[#2563eb] dark:text-[#3b82f6]"
              : "text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </div>
    </>
  );
}
export const dynamic = "force-dynamic";

"use client";

import React, { useEffect, useState, useRef } from "react";
import { User, Mail, Check, Loader2, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";

interface UserProfile {
  name: string;
  email: string;
  profilePic: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setName(data.name);
          setProfilePic(data.profilePic);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

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

      setProfilePic(data.fileUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, profilePic }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setSuccess(true);

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.name = name;
        parsed.profilePic = profilePic;
        localStorage.setItem("user", JSON.stringify(parsed));
      }

      window.dispatchEvent(new Event("profileUpdate"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d0e12] text-slate-800 dark:text-slate-200 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2b56ad] dark:text-[#3b82f6]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0e12] text-slate-800 dark:text-slate-200 flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            User Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Manage your account profile details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Left: Avatar preview */}
          <div className="flat-card p-6 flex flex-col items-center justify-center text-center h-fit bg-white dark:bg-[#15161e] border-slate-200 dark:border-slate-800">
            <div className="relative group mb-4">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile Photo"
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-24 h-24 rounded bg-slate-800 dark:bg-slate-200 text-white flex items-center justify-center text-3xl font-bold shadow-sm">
                  {name ? name[0].toUpperCase() : <User className="w-10 h-10" />}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Change Photo"
                )}
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
            />

            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 flex items-center gap-1.5 justify-center">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {profile?.email}
            </p>

            {profile && (
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 w-full flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Member Since: {formatDate(profile.createdAt)}
              </p>
            )}
          </div>

          {/* Card Right: Edit Form */}
          <div className="flat-card p-6 md:col-span-2 bg-white dark:bg-[#15161e] border-slate-200 dark:border-slate-800">
            <h3 className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-6">
              Profile Settings
            </h3>

            {error && (
              <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded text-xs font-semibold">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3px]" />
                Profile updated successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="relative opacity-65">
                <Input
                  label="Email Address (Disabled)"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                />
                <Mail className="absolute right-3 top-[32px] w-4 h-4 text-slate-500" />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-250 dark:border-slate-800">
                <Button type="submit" isLoading={isSaving} disabled={isUploading}>
                  Save Settings
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
export const dynamic = "force-dynamic";

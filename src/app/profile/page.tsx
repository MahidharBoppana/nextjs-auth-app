"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

import {
  User,
  Mail,
  CalendarDays,
  LogOut,
  Settings,
  Shield,
  Loader2,
} from "lucide-react";

interface UserData {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Get user information
  const getUserInfo = async () => {
    try {
      const response = await axios.get("/api/users/me");

      setUser(response.data.user);
    } catch (error: any) {
      console.error("Get user error:", error.message);

      toast.error(
        error.response?.data?.message || "Failed to retrieve user information.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const onLogout = async () => {
    try {
      setLoggingOut(true);

      const response = await axios.get("/api/users/logout");

      toast.success(response.data.message || "Logged out successfully");

      router.push("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);

      toast.error(
        error.response?.data?.message || "Failed to logout. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-500" size={36} />
          <p className="text-sm text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // No user found
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-white">
        <User size={48} className="text-slate-600" />

        <h2 className="text-xl font-semibold">Profile not available</h2>

        <p className="text-sm text-slate-400">
          Unable to retrieve your account information.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Account Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">My Profile</h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          {/* Banner */}
          <div className="h-36 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700" />

          <div className="px-6 pb-8 sm:px-8">
            {/* Avatar */}
            <div className="-mt-12 flex items-end justify-between">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-slate-900 bg-slate-800 shadow-xl">
                <User size={42} className="text-blue-400" />
              </div>
            </div>

            {/* User Name */}
            <div className="mt-5">
              <h2 className="text-2xl font-bold">{user.username}</h2>

              <p className="mt-1 text-sm text-slate-400">
                {user.isAdmin ? "Administrator" : "Standard Member"}
              </p>
            </div>

            {/* Personal Information */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Personal Information
              </h3>

              <div className="space-y-3">
                {/* Username */}
                <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <User size={20} className="text-blue-400" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Username</p>

                    <p className="mt-1 font-medium">{user.username}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="rounded-lg bg-violet-500/10 p-3">
                    <Mail size={20} className="text-violet-400" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Email Address</p>

                    <p className="mt-1 font-medium">{user.email}</p>
                  </div>
                </div>

                {/* Account Role */}
                <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="rounded-lg bg-orange-500/10 p-3">
                    <Shield size={20} className="text-orange-400" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Account Role</p>

                    <p className="mt-1 font-medium">
                      {user.isAdmin ? "Admin" : "User"}
                    </p>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="rounded-lg bg-pink-500/10 p-3">
                    <CalendarDays size={20} className="text-pink-400" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Member Since</p>

                    <p className="mt-1 font-medium">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => toast("Settings coming soon!")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-blue-500 hover:bg-slate-800"
              >
                <Settings size={18} />
                Settings
              </button>

              <button
                onClick={onLogout}
                disabled={loggingOut}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={18} />
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Your account security and privacy matter to us.
        </p>
      </div>
    </main>
  );
}

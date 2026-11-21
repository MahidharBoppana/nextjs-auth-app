"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const resetPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/verifyPassword", {
        token,
        newPassword: password,
      });

      toast.success(response.data.message);
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  if (loading) {
    return (
      <h1 className="flex justify-center items-center min-h-screen text-2xl font-bold text-white">
        Loading...
      </h1>
    );
  }

  if (error) {
    return (
      <h1 className="flex justify-center items-center min-h-screen text-2xl font-bold text-white">
        {error}
      </h1>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl flex flex-col gap-5">
        <label
          className="mb-2 block font-medium text-slate-300"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />

        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] $"
          onClick={resetPassword}
        >
          Change password
        </button>
      </div>
    </div>
  );
}

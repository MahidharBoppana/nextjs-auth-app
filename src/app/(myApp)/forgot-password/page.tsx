"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyPasswordEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotPassword", {
        email: email,
      });
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

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
          htmlFor="email"
        >
          Email
        </label>

        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          type="email"
          placeholder="Enter your email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] $"
          onClick={verifyPasswordEmail}
        >
          submit
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/";

export default function Login() {
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_BASE}/login/`, form);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      router.push("/");
    } catch (error) {
      const data = error?.response?.data;
      if (data && typeof data === "object") {
        setErrors({
          username: data.username,
          password: data.password,
          general: data.detail || data.non_field_errors?.[0] || "Login failed. Try again.",
        });
      } else {
        setErrors({ general: "Login failed. Try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32 text-white md:px-8 md:pt-36">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:grid-cols-2"
      >
        <div className="hidden border-r border-white/10 bg-gradient-to-br from-cyan-900/30 to-slate-900 p-10 md:block">
          <p className="inline-block rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1 text-xs text-cyan-200">
            Welcome Back
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight">
            Login to manage your portfolio.
          </h1>
          <p className="mt-4 text-slate-300">
            Access your dashboard, projects, and profile settings with secure authentication.
          </p>
        </div>

        <div className="p-6 md:p-10">
          <h2 className="text-3xl font-bold text-cyan-200">Login</h2>
          <p className="mt-2 text-sm text-slate-300">Enter your account details to continue.</p>

          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="rounded-xl border border-white/15 bg-slate-900/80 p-3 outline-none transition focus:border-cyan-300"
            />
            {errors.username && <p className="text-sm text-red-300">{errors.username}</p>}

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rounded-xl border border-white/15 bg-slate-900/80 p-3 outline-none transition focus:border-cyan-300"
            />
            {errors.password && <p className="text-sm text-red-300">{errors.password}</p>}

            {errors.general && <p className="text-sm text-red-300">{errors.general}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-cyan-300 p-3 font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <p className="mt-5 text-sm text-slate-300">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-cyan-200 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

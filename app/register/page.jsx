"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/";

export default function Register() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const autoLogin = async () => {
    const res = await axios.post(`${API_BASE}/login/`, {
      username: form.username,
      password: form.password,
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      setSubmitting(true);
      await axios.post(`${API_BASE}/register/`, form);
      await autoLogin();
      router.push("/");
    } catch (error) {
      const data = error?.response?.data;
      if (data && typeof data === "object") {
        setErrors({
          username: data.username,
          email: data.email,
          password: data.password,
          general: data.detail || data.non_field_errors?.[0] || "Registration failed. Try again.",
        });
      } else {
        setErrors({ general: "Registration failed. Try again." });
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
            New Account
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight">
            Create your account in minutes.
          </h1>
          <p className="mt-4 text-slate-300">
            Register to publish and manage your work with a clean and secure workflow.
          </p>
        </div>

        <div className="p-6 md:p-10">
          <h2 className="text-3xl font-bold text-cyan-200">Register</h2>
          <p className="mt-2 text-sm text-slate-300">Set up your account details to get started.</p>

          <form onSubmit={handleRegister} className="mt-6 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="rounded-xl border border-white/15 bg-slate-900/80 p-3 outline-none transition focus:border-cyan-300"
            />
            {errors.username && <p className="text-sm text-red-300">{errors.username}</p>}

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl border border-white/15 bg-slate-900/80 p-3 outline-none transition focus:border-cyan-300"
            />
            {errors.email && <p className="text-sm text-red-300">{errors.email}</p>}

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
              {submitting ? "Creating account..." : "Register"}
            </motion.button>
          </form>

          <p className="mt-5 text-sm text-slate-300">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-cyan-200 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

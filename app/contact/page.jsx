"use client";

import { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";

export default function ContactPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus({ type: "error", message: "Please fill all fields." });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: "", message: "" });

      await axios.post(`${API_BASE}/contact/`, payload);

      setStatus({ type: "success", message: "Message sent successfully." });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      const backendMessage =
        error?.response?.data?.detail ||
        Object.values(error?.response?.data || {})?.[0];

      setStatus({
        type: "error",
        message: backendMessage || "Failed to send message. Try again.",
      });
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
        className="mx-auto grid w-full max-w-6xl gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2 md:p-10"
      >
        <div>
          <p className="inline-block rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1 text-sm text-cyan-200">
            Start a Project
          </p>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">
            Let&apos;s build something professional.
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Share your goals and timeline. I will reply with the right scope,
            technical approach, and next steps.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-200">
            <p>
              Email:{" "}
              <a
                className="text-cyan-200 underline decoration-cyan-300/50 underline-offset-4"
                href="mailto:seems.developer@gmail.com"
              >
                seems.developer@gmail.com
              </a>
            </p>
            <p>Phone: (+91) 9685-8227-21</p>
            <p>Location: India</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-white/15 bg-slate-900/80 p-3 outline-none transition focus:border-cyan-300"
          />
          <input
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border border-white/15 bg-slate-900/80 p-3 outline-none transition focus:border-cyan-300"
          />
          <textarea
            placeholder="Your message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={6}
            className="rounded-xl border border-white/15 bg-slate-900/80 p-3 outline-none transition focus:border-cyan-300"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Sending..." : "Send Message"}
          </motion.button>

          {status.message && (
            <p
              className={`text-sm ${
                status.type === "success" ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}

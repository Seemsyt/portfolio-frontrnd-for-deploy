"use client"

import { useState } from "react"
import { motion } from "motion/react"
import axios from "axios"

export default function ContactPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/auth"

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [status, setStatus] = useState({ type: "", message: "" })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim()
    }

    if (!payload.name || !payload.email || !payload.message) {
      setStatus({ type: "error", message: "Please fill all fields." })
      return
    }

    try {
      setSubmitting(true)
      setStatus({ type: "", message: "" })

      await axios.post(`${API_BASE}/contact/`, payload)

      setStatus({ type: "success", message: "Message sent successfully." })
      setForm({ name: "", email: "", message: "" })
    } catch (error) {
      const backendMessage =
        error?.response?.data?.detail ||
        Object.values(error?.response?.data || {})?.[0]

      setStatus({
        type: "error",
        message: backendMessage || "Failed to send message. Try again."
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen px-4 py-12 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto grid max-w-5xl gap-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 md:grid-cols-2 md:p-10"
      >
        <div>
          <h1 className="text-3xl font-bold text-red-300 md:text-4xl">Contact Us</h1>
          <p className="mt-4 text-zinc-300">
            Tell us about your project and we will get back to you soon.
          </p>
          <div className="mt-8 space-y-3 text-sm text-zinc-200">
            <p>
              Email:{" "}
              <a className="underline" href="mailto:seems.developer@gmail.com">
                seems.developer@gmail.com
              </a>
            </p>
            <p>Phone:  (+91) 9685-8227-21</p>
            <p>Location: United States</p>
          </div>
        </div> 

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none focus:border-white"
          />
          <input
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none focus:border-white"
          />
          <textarea
            placeholder="Your message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={6}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none focus:border-white"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-white p-3 font-semibold text-black"
          >
            {submitting ? "Sending..." : "Send Message"}
          </motion.button>
          {status.message && (
            <p className={`text-sm ${status.type === "success" ? "text-green-300" : "text-red-300"}`}>
              {status.message}
            </p>
          )}
        </form>
      </motion.div>
    </section>
  )
}

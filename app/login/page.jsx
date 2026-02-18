"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Login() {

  const router = useRouter()

  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    username: "",
    password: ""
  })


  const login = async (e) => {
    e.preventDefault()

    setErrors({}) // clear old errors

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        form
      )

      // save tokens
      localStorage.setItem("access", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)

      // redirect to home
      router.push("/")

    } catch (error) {

      if (error.response && error.response.data) {
        setErrors(error.response.data)
        setErrors({ general: "Login failed. Try again." })
      } else {
        setErrors({ general: "Login failed. Try again." })
      }

    }
  }


  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-zinc-900 p-8 rounded-2xl w-[350px] shadow-lg"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>


        <form onSubmit={login} className="flex flex-col gap-4">


          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="p-3 rounded bg-zinc-800 outline-none focus:ring-2 focus:ring-white"
          />

          {errors.username && (
            <p className="text-red-500 text-sm">
              {errors.username}
            </p>
          )}


          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="p-3 rounded bg-zinc-800 outline-none focus:ring-2 focus:ring-white"
          />

          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password}
            </p>
          )}


          {/* General error */}
          {errors.general && (
            <p className="text-red-500 text-sm text-center">
              {errors.general}
            </p>
          )}


          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black p-3 rounded font-semibold"
          >
            Login
          </motion.button>


        </form>


        <p className="text-center mt-4 text-gray-400">
          Don't have account?{" "}
          <Link href="/register" className="text-white underline">
            Register
          </Link>
        </p>


      </motion.div>

    </div>
  )
}

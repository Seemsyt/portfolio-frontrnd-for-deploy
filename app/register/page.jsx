"use client"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import { motion } from "motion/react"
import Link from "next/link"
import axios from "axios"

export default function Register() {
  const router =useRouter()
      const [erors, setErors] = useState('')
    const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  })
 const login = async () => {
  try {
    const res = await axios.post('https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/login/', {
      username: form.username,
      password: form.password
    });

    const data = res.data;
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
  } catch (err) {
    console.log("Login failed:", err.response?.data || err.message);
    throw err; // propagate error to handleRegister
  }
};
const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      'https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/register/',
      form
    );

    console.log("Register success:", response.data);

    // Wait for login to complete
    await login();

    // Redirect
    router.push('/');
  } catch (error) {
    if (error.response) {
      setErors(error.response.data);
      console.log("Backend errors:", error.response.data);
    } else {
      console.log("Network or other error:", error.message);
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-zinc-900 p-8 rounded-2xl w-[350px] shadow-lg"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Register
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Username"
            className="p-3 rounded bg-zinc-800 outline-none focus:ring-2 focus:ring-white"
            onChange={(e)=>setForm({...form,username:e.target.value})}/>
            
            {erors.username && <p className="text-red-500">{erors.username}</p>}

          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-zinc-800 outline-none focus:ring-2 focus:ring-white"
            onChange={(e)=>setForm({...form,email:e.target.value})} />
            {erors.email && <p className="text-red-500">{erors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-zinc-800 outline-none focus:ring-2 focus:ring-white"
            onChange={(e)=>setForm({...form,password:e.target.value})}
          />
          {erors.password && <p className="text-red-500">{erors.password}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black p-3 rounded font-semibold"
            type="submit" >
            Register
          </motion.button>

        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have account?{" "}
          <Link href="/login" className="text-white underline">
            Login
          </Link>
        </p>

      </motion.div>

    </div>
  )
}

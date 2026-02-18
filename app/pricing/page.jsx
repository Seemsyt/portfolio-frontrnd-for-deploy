"use client"
import { use, useEffect,useState } from "react"
import { motion } from "motion/react"
import axios from "axios"
import { div } from "motion/react-client"
export default function PricingPage() {
  const [plan,setPlan]= useState([])
  const [loading, setLoading] = useState(true)

  const plans = async()=>{
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/pricing/`
      )

      setPlan(response.data)
      setLoading(false)

    } catch (error) {
      console.error("Error fetching plans:", error)
    }
  }
  useEffect(()=>{
    plans()
  },[])
 
  
  return (

    <section className="min-h-screen px-4 py-12 md:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl font-bold text-red-300 md:text-5xl"
        >
          Pricing Plans
        </motion.h1>
        <p className="mt-3 text-center text-zinc-300">
          Choose the package that fits your project.
        </p>
       {loading && (<h1>Loading...</h1>)}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plan.map((p, index) => (
            <motion.article
              key={p.title + p.price}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <h2 className="text-xl font-bold">{p.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{p.is_admin}</p>
              <p className="mt-4 text-4xl font-extrabold text-red-300">${p.price}</p>
              <ul className="mt-5 space-y-2 text-sm text-zinc-200">
                {p.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-lg bg-white px-4 py-2 font-semibold text-black">
                Get Started
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

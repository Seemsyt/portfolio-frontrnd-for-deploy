'use client'

import {motion} from 'motion/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/"

const page = () => {
  const [project , setProject] = useState([])
  const [loading, setLoading] = useState(true)

  const projects = async ()=> {
    try {
      const response = await axios.get(`${API_BASE}/projects/`)
      setProject(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    projects()
  }, [])

  return (
    <div className='min-h-screen'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading && (<h1>Loading...</h1>)}
       {project.map((p,index) => (
       <motion.div
        key={p.id || index}
        initial={{y:100,x:-100,
          opacity:0
        }}
        whileInView={{y:0,opacity:1,x:0}}
        transition={{duration:0.7}}
        viewport={{once :true}}

        className='border-zinc-800 text-zinc-300 border overflow-hidden p-2 m-2 rounded-2xl bg-zinc-950/70'
       >
        <h1 className='font-sans font-bold text-xl m-2'>{p.title}</h1>
        <img className='border border-zinc-800 rounded-2xl overflow-hidden' src={p.image} alt={p.title} />
        <p className='font-bold text-lg'>{p.discription}</p>
        {p.live_link && (
          <a
            href={p.live_link}
            target="_blank"
            rel="noreferrer"
            className='inline-block text-black bg-white border-2 p-1 rounded-2xl'
          >
            Live link
          </a>
        )}
        </motion.div>
       ))}
      </div>
    </div>
  )
}

export default page

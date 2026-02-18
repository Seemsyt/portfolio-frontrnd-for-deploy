'use client'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/auth'
const API_ORIGIN = API_BASE.split('/api/')[0]

const Card = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE}/projects/home/`)
        const data = Array.isArray(response.data) ? response.data : (response.data?.results || [])
        setProjects(data)
      } catch (err) {
        setError('Failed to load projects.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const resolveImage = (path) => {
    if (!path) return '/bg2.jpg'
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
  }

  return (
    <>
    <div className='grid p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:p-6'>
      {loading && <p className="p-6">Loading projects...</p>}
      {error && <p className="p-6 text-red-400">{error}</p>}

      {!loading && !error && projects.map((project, index) => (
        <motion.div
          key={project.id || index}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="p-6"
        >
          <div className="rounded-2xl border-2 overflow-hidden">
            <img src={resolveImage(project.image)} alt={project.title || 'Project image'} />
          </div>
          <div>{project.discription}</div>
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 px-3 py-1 border rounded-md bg-white text-black"
            >
              Visit
            </a>
          )}
        </motion.div>
      ))}
    </div>
    </>
  )
}

export default Card

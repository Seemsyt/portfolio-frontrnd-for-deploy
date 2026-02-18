"use client"

import { motion } from "motion/react"

const skills = [
  {
    title: "Frontend Development",
    stack: "React, Next.js, Tailwind CSS",
    summary: "Builds responsive, clean interfaces with smooth interactions.",
    level: 88
  },
  {
    title: "Backend Development",
    stack: "Django, DRF, API Design",
    summary: "Creates secure APIs with auth, data validation, and admin tools.",
    level: 82
  },
  {
    title: "Database & Data",
    stack: "PostgreSQL, SQLite, ORM",
    summary: "Designs practical schemas and efficient query flows.",
    level: 78
  },
  {
    title: "Deployment",
    stack: "Git, Linux, Vercel, Render",
    summary: "Ships projects end-to-end from development to production.",
    level: 75
  }
]

const Skill = () => {
  return (
    <div className="mx-auto mt-4 grid max-w-6xl grid-cols-1 gap-4 p-2 md:grid-cols-2 lg:grid-cols-4">
      {skills.map((skill, index) => (
        <motion.article
          key={skill.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-lg"
        >
          <h3 className="text-lg font-bold text-red-300">{skill.title}</h3>
          <p className="mt-2 text-sm font-semibold text-zinc-200">{skill.stack}</p>
          <p className="mt-2 text-sm text-zinc-400">{skill.summary}</p>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-zinc-300">
              <span>Skill level</span>
              <span>{skill.level}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-700">
              <div
                className="h-2 rounded-full bg-red-300"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  )
}

export default Skill

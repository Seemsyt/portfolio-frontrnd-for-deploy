"use client";

import { motion } from "motion/react";
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/";
const API_ORIGIN = API_BASE.split("/api/")[0];

const resolveImage = (path) => {
  if (!path) return "/bg2.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

export default function ProjectsPage() {
  const skeletonCards = Array.from({ length: 6 });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE}/projects/`);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];
        setProjects(data);
      } catch {
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32 text-white md:px-8 md:pt-36">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-cyan-200 md:text-5xl">
            Projects
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Real builds with practical UI, backend integration, and production
            readiness.
          </p>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skeletonCards.map((_, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.08 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="h-48 w-full rounded-xl border border-white/10 bg-slate-700/40" />
                <div className="mt-4 h-6 w-2/3 rounded-md bg-slate-700/40" />
                <div className="mt-3 h-4 w-full rounded-md bg-slate-700/30" />
                <div className="mt-2 h-4 w-5/6 rounded-md bg-slate-700/30" />
                <div className="mt-4 h-9 w-36 rounded-lg bg-cyan-300/20" />
              </motion.article>
            ))}
          </div>
        )}
        {error && <p className="py-10 text-center text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const description =
                project.description ||
                project.discription ||
                "No description provided yet.";
              const liveLink =
                project.live_link || project.liveLink || project.url || "";

              return (
                <motion.article
                  key={project.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={resolveImage(project.image)}
                      alt={project.title || "Project image"}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-white">
                    {project.title || "Untitled Project"}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {description}
                  </p>

                  {liveLink && (
                    <a
                      href={liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300 hover:text-slate-900"
                    >
                      View Live Project
                    </a>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import Card from "./components/Card";
import Link from "next/link";
import Skill from "./components/skill";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden border-b border-white/10"
      >
        <div className="absolute inset-0 bg-[url(/bg2.jpg)] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/75 to-cyan-900/45" />

        <main className="relative mx-auto flex min-h-[88vh] w-full max-w-6xl items-center px-6 pb-16 pt-36 md:pt-40">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-5 inline-block rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1 text-sm font-medium tracking-wide text-cyan-200"
            >
              Full-Stack Portfolio & Product Development
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl font-extrabold leading-tight md:text-6xl"
            >
              Build a professional digital presence that drives trust.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg"
            >
              I design and ship modern portfolio and business websites with
              clean UI, fast performance, and practical backend integration.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                href="/projects"
                className="rounded-xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200"
              >
                View Projects
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Contact Me
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 grid grid-cols-3 gap-3 sm:max-w-xl"
            >
              <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-center">
                <p className="text-2xl font-bold text-cyan-200">20+</p>
                <p className="text-xs text-slate-300">Delivered pages</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-center">
                <p className="text-2xl font-bold text-cyan-200">4+</p>
                <p className="text-xs text-slate-300">Core stacks</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-center">
                <p className="text-2xl font-bold text-cyan-200">100%</p>
                <p className="text-xs text-slate-300">Client focus</p>
              </div>
            </motion.div>
          </div>
        </main>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto w-full max-w-6xl px-4 py-14 md:py-20"
      >
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-cyan-200">Featured Projects</h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-300">
            Selected work focused on practical design, strong UX, and reliable
            backend connectivity.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03]">
          <Card />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto mb-16 w-full max-w-6xl px-4"
      >
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-cyan-300/[0.05] p-6 md:p-10">
          <h2 className="text-center text-3xl font-bold text-cyan-200">
            About the Developer
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-center text-slate-300">
            Hey, I am Seems. I build responsive and scalable web products that
            help creators and businesses present themselves professionally
            online.
          </p>
          <h3 className="mt-8 text-center text-2xl font-semibold text-white">
            Core Skills
          </h3>
          <Skill />
        </div>
      </motion.section>
    </div>
  );
}

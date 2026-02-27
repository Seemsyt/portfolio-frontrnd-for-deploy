"use client";

import { motion } from "motion/react";
import Link from "next/link";

const plans = [
  {
    title: "Starter",
    price: "$199",
    description: "For personal portfolios and simple business websites.",
    features: [
      "Up to 3 responsive pages",
      "Basic SEO setup",
      "Contact form integration",
      "Delivery in 4-5 days",
    ],
    cta: "Get Starter",
    featured: false,
  },
  {
    title: "Professional",
    price: "$499",
    description: "For serious brands needing polished design and structure.",
    features: [
      "Up to 8 custom pages",
      "Modern UI with animations",
      "CMS/API integration",
      "Priority support",
    ],
    cta: "Choose Professional",
    featured: true,
  },
  {
    title: "Business",
    price: "$999",
    description: "For growth-focused teams with custom technical needs.",
    features: [
      "Advanced full-stack setup",
      "Custom dashboard features",
      "Performance optimization",
      "Post-launch support",
    ],
    cta: "Book Consultation",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32 text-white md:px-8 md:pt-36">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="inline-block rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1 text-sm text-cyan-200">
            Pricing
          </p>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">Simple plans for every stage.</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Pick a package based on your current goals. All plans include clean
            code, responsive design, and production-ready delivery.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-2xl border p-6 shadow-xl ${
                plan.featured
                  ? "border-cyan-300/60 bg-cyan-300/[0.08]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <h2 className="text-xl font-bold">{plan.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
              <p className="mt-5 text-4xl font-extrabold text-cyan-200">{plan.price}</p>

              <ul className="mt-5 space-y-2 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`mt-6 inline-block w-full rounded-xl px-4 py-2 text-center font-semibold transition ${
                  plan.featured
                    ? "bg-cyan-300 text-slate-900 hover:bg-cyan-200"
                    : "border border-white/25 bg-white/5 text-white hover:bg-white/15"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

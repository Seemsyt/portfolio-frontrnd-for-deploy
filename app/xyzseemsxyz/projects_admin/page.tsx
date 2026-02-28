'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

type Project = {
  id: number;
  title: string;
  image?: string;
  discription?: string;
  live_link?: string;
};

type PricingPlan = {
  id: number;
  title: string;
  price: number;
  slug: string;
  is_admin: string;
  features: string[];
};

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

type ContactStatus = {
  type: '' | 'success' | 'error';
  message: string;
};

const parseList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object' && 'results' in payload) {
    const results = (payload as { results?: unknown }).results;
    return Array.isArray(results) ? (results as T[]) : [];
  }
  return [];
};

const asCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const resolveImage = (path: string | undefined, apiBase: string) => {
  if (!path) return '/bg2.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const apiOrigin = apiBase.split('/api/')[0];
  return `${apiOrigin}${path.startsWith('/') ? path : `/${path}`}`;
};

export default function ProjectsAdminPage() {
  const rawApiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/';
  const baseUrl = rawApiBase.replace(/\/+$/, '');

  const [projects, setProjects] = useState<Project[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastSync, setLastSync] = useState<string>('');

  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<ContactStatus>({
    type: '',
    message: '',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');

      try {
        const [projectRes, pricingRes] = await Promise.allSettled([
          axios.get(`${baseUrl}/projects/`),
          axios.get(`${baseUrl}/pricing/`),
        ]);

        const fetchedProjects =
          projectRes.status === 'fulfilled' ? parseList<Project>(projectRes.value.data) : [];
        const fetchedPricing =
          pricingRes.status === 'fulfilled' ? parseList<PricingPlan>(pricingRes.value.data) : [];

        setProjects(fetchedProjects);
        setPricing(fetchedPricing);
        setLastSync(
          new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        );

        if (projectRes.status === 'rejected' || pricingRes.status === 'rejected') {
          setError('Some collections could not be loaded from API.');
        }
      } catch {
        setProjects([]);
        setPricing([]);
        setError('Dashboard API unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [baseUrl]);

  const stats = useMemo(() => {
    const projectsWithLinks = projects.filter((project) => Boolean(project.live_link)).length;
    const adminPlans = pricing.filter((plan) => String(plan.is_admin).toLowerCase() === 'true').length;
    const totalFeatures = pricing.reduce(
      (featureCount, plan) => featureCount + (Array.isArray(plan.features) ? plan.features.length : 0),
      0
    );

    return [
      { label: 'Projects', value: projects.length, helper: `${projectsWithLinks} with live link` },
      { label: 'Pricing Plans', value: pricing.length, helper: `${adminPlans} admin plans` },
      { label: 'Total Features', value: totalFeatures, helper: 'From pricing API payload' },
    ];
  }, [projects, pricing]);

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      message: contactForm.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setContactStatus({ type: 'error', message: 'Please fill all contact fields.' });
      return;
    }

    try {
      setContactSubmitting(true);
      setContactStatus({ type: '', message: '' });
      await axios.post(`${baseUrl}/contact/`, payload);
      setContactStatus({ type: 'success', message: 'Contact message submitted to backend.' });
      setContactForm({ name: '', email: '', message: '' });
    } catch (submitError: unknown) {
      const backendMessage =
        (submitError as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Failed to submit contact message.';
      setContactStatus({ type: 'error', message: backendMessage });
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32 text-white md:px-8 md:pt-36">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-block rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              CMS Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">Content Management</h1>
            <p className="mt-2 text-slate-300">
              Dashboard mapped to your Django models: Project, Pricing, and Contact.
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
            API Base: <span className="font-semibold text-cyan-200">{baseUrl}</span>
            <p className="mt-1 text-xs text-slate-400">Last sync: {lastSync || 'Not synced yet'}</p>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-slate-300">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-cyan-200">{loading ? '-' : stat.value}</p>
              <p className="mt-1 text-xs text-slate-400">{loading ? 'Loading data...' : stat.helper}</p>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <section className="xl:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Projects</h2>
              <p className="text-xs text-slate-400">`GET /projects/`, `PATCH /projects/:id/`</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-slate-300">
                    <th className="py-2 font-medium">Title</th>
                    <th className="py-2 font-medium">Image</th>
                    <th className="py-2 font-medium">Description</th>
                    <th className="py-2 font-medium">Live Link</th>
                    <th className="py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(loading ? [] : projects).slice(0, 8).map((project) => (
                    <tr key={project.id} className="border-b border-white/5 text-slate-100">
                      <td className="py-3 pr-2 font-medium">{project.title || 'Untitled project'}</td>
                      <td className="py-3 pr-2">
                        <img
                          src={resolveImage(project.image, baseUrl)}
                          alt={project.title}
                          className="h-10 w-14 rounded object-cover"
                        />
                      </td>
                      <td className="max-w-[320px] py-3 pr-2 text-slate-300">
                        {(project.discription || '').slice(0, 80) || 'No description'}
                        {(project.discription || '').length > 80 ? '...' : ''}
                      </td>
                      <td className="py-3 pr-2">
                        {project.live_link ? (
                          <a
                            href={project.live_link}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-200 hover:bg-cyan-300/20"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-slate-500">N/A</span>
                        )}
                      </td>
                      <td className="py-3 pr-2">
                        <Link
                          href={`/xyzseemsxyz/projects_admin/projects/${project.id}`}
                          className="rounded-md border border-white/20 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {!loading && projects.length === 0 && (
                    <tr>
                      <td className="py-5 text-slate-400" colSpan={5}>
                        No projects returned from API.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="xl:col-span-2 grid grid-cols-1 gap-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Pricing</h2>
                <p className="text-xs text-slate-400">`GET /pricing/`, `PATCH /pricing/:id/`</p>
              </div>

              <div className="space-y-3">
                {(loading ? [] : pricing).slice(0, 6).map((plan) => (
                  <article
                    key={plan.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3"
                  >
                    <div>
                      <p className="font-medium">{plan.title}</p>
                      <p className="text-xs text-slate-400">Slug: {plan.slug}</p>
                      <p className="mt-1 text-sm text-cyan-200">{asCurrency(plan.price)}</p>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-300">
                      {(plan.features || []).slice(0, 3).map((feature) => (
                        <li key={`${plan.id}-${feature}`}>• {feature}</li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <Link
                        href={`/xyzseemsxyz/projects_admin/pricing/${plan.id}`}
                        className="rounded-md border border-white/20 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                      >
                        Edit Plan
                      </Link>
                    </div>
                  </article>
                ))}
                {!loading && pricing.length === 0 && (
                  <p className="text-sm text-slate-400">No pricing plans returned from API.</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-xl font-semibold">Contact Endpoint Test</h2>
              <p className="mt-1 text-xs text-slate-400">`POST /contact/` (write enabled)</p>

              <form className="mt-4 space-y-3" onSubmit={handleContactSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={contactForm.name}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, message: event.target.value }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                />
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {contactSubmitting ? 'Submitting...' : 'Submit Contact'}
                </button>
                {contactStatus.message && (
                  <p
                    className={`text-xs ${
                      contactStatus.type === 'success' ? 'text-emerald-300' : 'text-red-300'
                    }`}
                  >
                    {contactStatus.message}
                  </p>
                )}
              </form>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-xl font-semibold">Backend Capability</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  <span className="text-cyan-200">Project:</span> list + detail edit enabled.
                </li>
                <li>
                  <span className="text-cyan-200">Pricing:</span> list + detail edit enabled.
                </li>
                <li>
                  <span className="text-cyan-200">Contact:</span> create (submit) enabled.
                </li>
                <li>
                  <span className="text-cyan-200">Edit Pages:</span> separate project/pricing edit routes.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDashboardAuthHeaders, verifyDashboardAccess } from '@/app/lib/dashboardAuth';

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

type ProjectCreateForm = {
  title: string;
  discription: string;
  live_link: string;
  image: File | null;
};

type PricingCreateForm = {
  title: string;
  price: string;
  slug: string;
  is_admin: string;
  feature_1: string;
  feature_2: string;
  feature_3: string;
  feature_4: string;
  feature_5: string;
  feature_6: string;
};

type SaveStatus = {
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
  const router = useRouter();
  const rawApiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/';
  const baseUrl = rawApiBase.replace(/\/+$/, '');

  const [projects, setProjects] = useState<Project[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
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

  const [projectCreateForm, setProjectCreateForm] = useState<ProjectCreateForm>({
    title: '',
    discription: '',
    live_link: '',
    image: null,
  });
  const [projectCreating, setProjectCreating] = useState(false);
  const [projectCreateStatus, setProjectCreateStatus] = useState<SaveStatus>({
    type: '',
    message: '',
  });
  const [projectDeletingId, setProjectDeletingId] = useState<number | null>(null);
  const [projectDeleteStatus, setProjectDeleteStatus] = useState<SaveStatus>({
    type: '',
    message: '',
  });

  const [pricingCreateForm, setPricingCreateForm] = useState<PricingCreateForm>({
    title: '',
    price: '',
    slug: '',
    is_admin: 'false',
    feature_1: '',
    feature_2: '',
    feature_3: '',
    feature_4: '',
    feature_5: '',
    feature_6: '',
  });
  const [pricingCreating, setPricingCreating] = useState(false);
  const [pricingCreateStatus, setPricingCreateStatus] = useState<SaveStatus>({
    type: '',
    message: '',
  });
  const [pricingDeletingId, setPricingDeletingId] = useState<number | null>(null);
  const [pricingDeleteStatus, setPricingDeleteStatus] = useState<SaveStatus>({
    type: '',
    message: '',
  });

  const fetchCollections = useCallback(async () => {
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
  }, [baseUrl]);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      const accessResult = await verifyDashboardAccess(baseUrl);
      if (!accessResult.allowed) {
        router.replace('/login?next=/xyzseemsxyz/projects_admin');
        return;
      }

      setLoading(true);
      setError('');
      if (isMounted) {
        setCheckingAccess(false);
      }

      try {
        await fetchCollections();
      } catch {
        setProjects([]);
        setPricing([]);
        setError('Dashboard API unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, [baseUrl, fetchCollections, router]);

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

  const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectCreateForm.title.trim() || !projectCreateForm.discription.trim() || !projectCreateForm.image) {
      setProjectCreateStatus({
        type: 'error',
        message: 'Title, description and image are required to create a project.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', projectCreateForm.title.trim());
    formData.append('discription', projectCreateForm.discription.trim());
    formData.append('live_link', projectCreateForm.live_link.trim());
    formData.append('image', projectCreateForm.image);

    try {
      setProjectCreating(true);
      setProjectCreateStatus({ type: '', message: '' });
      const { headers } = getDashboardAuthHeaders();
      await axios.post(`${baseUrl}/projects/`, formData, { headers });
      await fetchCollections();
      setProjectCreateForm({ title: '', discription: '', live_link: '', image: null });
      setProjectCreateStatus({ type: 'success', message: 'New project created successfully.' });
    } catch (submitError: unknown) {
      const backendMessage =
        (submitError as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Failed to create project.';
      setProjectCreateStatus({ type: 'error', message: backendMessage });
    } finally {
      setProjectCreating(false);
    }
  };

  const handleCreatePricing = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !pricingCreateForm.title.trim() ||
      !pricingCreateForm.slug.trim() ||
      !pricingCreateForm.price.trim() ||
      !pricingCreateForm.feature_1.trim()
    ) {
      setPricingCreateStatus({
        type: 'error',
        message: 'Title, price, slug and feature 1 are required to create pricing.',
      });
      return;
    }

    try {
      setPricingCreating(true);
      setPricingCreateStatus({ type: '', message: '' });
      const { headers } = getDashboardAuthHeaders();
      await axios.post(
        `${baseUrl}/pricing/`,
        {
          title: pricingCreateForm.title.trim(),
          price: Number(pricingCreateForm.price),
          slug: pricingCreateForm.slug.trim(),
          is_admin: pricingCreateForm.is_admin.trim(),
          feature_1: pricingCreateForm.feature_1.trim(),
          feature_2: pricingCreateForm.feature_2.trim(),
          feature_3: pricingCreateForm.feature_3.trim(),
          feature_4: pricingCreateForm.feature_4.trim(),
          feature_5: pricingCreateForm.feature_5.trim(),
          feature_6: pricingCreateForm.feature_6.trim(),
        },
        { headers }
      );
      await fetchCollections();
      setPricingCreateForm({
        title: '',
        price: '',
        slug: '',
        is_admin: 'false',
        feature_1: '',
        feature_2: '',
        feature_3: '',
        feature_4: '',
        feature_5: '',
        feature_6: '',
      });
      setPricingCreateStatus({ type: 'success', message: 'New pricing plan created successfully.' });
    } catch (submitError: unknown) {
      const backendMessage =
        (submitError as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Failed to create pricing.';
      setPricingCreateStatus({ type: 'error', message: backendMessage });
    } finally {
      setPricingCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    const confirmed = window.confirm('Delete this project permanently?');
    if (!confirmed) return;

    try {
      setProjectDeletingId(projectId);
      setProjectDeleteStatus({ type: '', message: '' });
      const { headers } = getDashboardAuthHeaders();
      await axios.delete(`${baseUrl}/projects/${projectId}/`, { headers });
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      setProjectDeleteStatus({ type: 'success', message: 'Project deleted successfully.' });
    } catch (deleteError: unknown) {
      const backendMessage =
        (deleteError as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Failed to delete project.';
      setProjectDeleteStatus({ type: 'error', message: backendMessage });
    } finally {
      setProjectDeletingId(null);
    }
  };

  const handleDeletePricing = async (planId: number) => {
    const confirmed = window.confirm('Delete this pricing plan permanently?');
    if (!confirmed) return;

    try {
      setPricingDeletingId(planId);
      setPricingDeleteStatus({ type: '', message: '' });
      const { headers } = getDashboardAuthHeaders();
      await axios.delete(`${baseUrl}/pricing/${planId}/`, { headers });
      setPricing((prev) => prev.filter((plan) => plan.id !== planId));
      setPricingDeleteStatus({ type: 'success', message: 'Pricing plan deleted successfully.' });
    } catch (deleteError: unknown) {
      const backendMessage =
        (deleteError as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Failed to delete pricing plan.';
      setPricingDeleteStatus({ type: 'error', message: backendMessage });
    } finally {
      setPricingDeletingId(null);
    }
  };

  if (checkingAccess) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32 text-white md:px-8 md:pt-36">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-center">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-slate-200">
            <span className="mr-3 inline-block h-4 w-4 animate-spin rounded-full border-2 border-cyan-200 border-t-transparent" />
            Checking dashboard access...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32 text-white md:px-8 md:pt-36">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" id="overview">
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

        <nav className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm">
          <a href="#overview" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:bg-white/10">Overview</a>
          <a href="#projects" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:bg-white/10">Projects</a>
          <a href="#pricing" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:bg-white/10">Pricing</a>
          <a href="#add-project" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:bg-white/10">Add Project</a>
          <a href="#add-pricing" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:bg-white/10">Add Pricing</a>
          <a href="#contact" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:bg-white/10">Contact</a>
        </nav>

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
          <section id="projects" className="xl:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Projects</h2>
              <p className="text-xs text-slate-400">`GET /projects/`, `POST /projects/`, `PATCH /projects/:id/`, `DELETE /projects/:id/`</p>
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
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          disabled={projectDeletingId === project.id}
                          className="ml-2 rounded-md border border-red-300/40 bg-red-300/10 px-2 py-1 text-xs text-red-200 hover:bg-red-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {projectDeletingId === project.id ? 'Deleting...' : 'Delete'}
                        </button>
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
            {projectDeleteStatus.message && (
              <p className={`mt-3 text-xs ${projectDeleteStatus.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                {projectDeleteStatus.message}
              </p>
            )}
          </section>

          <div className="xl:col-span-2 grid grid-cols-1 gap-6">
            <section id="pricing" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Pricing</h2>
                <p className="text-xs text-slate-400">`GET /pricing/`, `POST /pricing/`, `PATCH /pricing/:id/`, `DELETE /pricing/:id/`</p>
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
                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        href={`/xyzseemsxyz/projects_admin/pricing/${plan.id}`}
                        className="rounded-md border border-white/20 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                      >
                        Edit Plan
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeletePricing(plan.id)}
                        disabled={pricingDeletingId === plan.id}
                        className="rounded-md border border-red-300/40 bg-red-300/10 px-2 py-1 text-xs text-red-200 hover:bg-red-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pricingDeletingId === plan.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </article>
                ))}
                {!loading && pricing.length === 0 && (
                  <p className="text-sm text-slate-400">No pricing plans returned from API.</p>
                )}
              </div>
              {pricingDeleteStatus.message && (
                <p className={`mt-3 text-xs ${pricingDeleteStatus.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                  {pricingDeleteStatus.message}
                </p>
              )}
            </section>

            <section id="add-project" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-xl font-semibold">Add Project</h2>
              <p className="mt-1 text-xs text-slate-400">Create new project content directly from dashboard.</p>

              <form className="mt-4 space-y-3" onSubmit={handleCreateProject}>
                <input
                  type="text"
                  placeholder="Project title"
                  value={projectCreateForm.title}
                  onChange={(event) =>
                    setProjectCreateForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                />
                <textarea
                  rows={4}
                  placeholder="Project description"
                  value={projectCreateForm.discription}
                  onChange={(event) =>
                    setProjectCreateForm((prev) => ({ ...prev, discription: event.target.value }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                />
                <input
                  type="url"
                  placeholder="Live link (optional)"
                  value={projectCreateForm.live_link}
                  onChange={(event) =>
                    setProjectCreateForm((prev) => ({ ...prev, live_link: event.target.value }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setProjectCreateForm((prev) => ({
                      ...prev,
                      image: event.target.files?.[0] ?? null,
                    }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-cyan-300 file:px-3 file:py-1 file:text-slate-900"
                />

                <button
                  type="submit"
                  disabled={projectCreating}
                  className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {projectCreating ? 'Creating...' : 'Create Project'}
                </button>

                {projectCreateStatus.message && (
                  <p className={`text-xs ${projectCreateStatus.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                    {projectCreateStatus.message}
                  </p>
                )}
              </form>
            </section>

            <section id="add-pricing" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-xl font-semibold">Add Pricing</h2>
              <p className="mt-1 text-xs text-slate-400">Create pricing plans and features from dashboard.</p>

              <form className="mt-4 space-y-3" onSubmit={handleCreatePricing}>
                <input
                  type="text"
                  placeholder="Plan title"
                  value={pricingCreateForm.title}
                  onChange={(event) =>
                    setPricingCreateForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input
                    type="number"
                    placeholder="Price"
                    value={pricingCreateForm.price}
                    onChange={(event) =>
                      setPricingCreateForm((prev) => ({ ...prev, price: event.target.value }))
                    }
                    className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                  />
                  <input
                    type="text"
                    placeholder="Slug"
                    value={pricingCreateForm.slug}
                    onChange={(event) =>
                      setPricingCreateForm((prev) => ({ ...prev, slug: event.target.value }))
                    }
                    className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                  />
                </div>
                <select
                  value={pricingCreateForm.is_admin}
                  onChange={(event) =>
                    setPricingCreateForm((prev) => ({ ...prev, is_admin: event.target.value }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                >
                  <option value="false">User Plan</option>
                  <option value="true">Admin Plan</option>
                </select>

                {(['feature_1', 'feature_2', 'feature_3', 'feature_4', 'feature_5', 'feature_6'] as const).map(
                  (featureKey, index) => (
                    <input
                      key={featureKey}
                      type="text"
                      placeholder={`Feature ${index + 1}${index === 0 ? ' (required)' : ' (optional)'}`}
                      value={pricingCreateForm[featureKey]}
                      onChange={(event) =>
                        setPricingCreateForm((prev) => ({ ...prev, [featureKey]: event.target.value }))
                      }
                      className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                    />
                  )
                )}

                <button
                  type="submit"
                  disabled={pricingCreating}
                  className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pricingCreating ? 'Creating...' : 'Create Pricing'}
                </button>

                {pricingCreateStatus.message && (
                  <p className={`text-xs ${pricingCreateStatus.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                    {pricingCreateStatus.message}
                  </p>
                )}
              </form>
            </section>

            <section id="contact" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
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
                  <span className="text-cyan-200">Project:</span> list + create + detail edit + delete enabled.
                </li>
                <li>
                  <span className="text-cyan-200">Pricing:</span> list + create + detail edit + delete enabled.
                </li>
                <li>
                  <span className="text-cyan-200">Contact:</span> create (submit) enabled.
                </li>
                <li>
                  <span className="text-cyan-200">Navigation:</span> quick jump links for all dashboard sections.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

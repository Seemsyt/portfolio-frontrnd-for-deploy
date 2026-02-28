'use client';

import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ProjectForm = {
  title: string;
  discription: string;
  live_link: string;
};

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id;
  const rawApiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/';
  const baseUrl = rawApiBase.replace(/\/+$/, '');

  const [form, setForm] = useState<ProjectForm>({
    title: '',
    discription: '',
    live_link: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: '' | 'success' | 'error'; message: string }>({
    type: '',
    message: '',
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/projects/${projectId}/`);
        const data = response.data || {};
        setForm({
          title: data.title || '',
          discription: data.discription || '',
          live_link: data.live_link || '',
        });
      } catch {
        setStatus({ type: 'error', message: 'Failed to load project.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [baseUrl, projectId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId) return;
    if (!form.title.trim() || !form.discription.trim()) {
      setStatus({ type: 'error', message: 'Title and description are required.' });
      return;
    }
    try {
      setSaving(true);
      setStatus({ type: '', message: '' });
      await axios.patch(`${baseUrl}/projects/${projectId}/`, {
        title: form.title.trim(),
        discription: form.discription.trim(),
        live_link: form.live_link.trim(),
      });
      setStatus({ type: 'success', message: 'Project updated successfully.' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to update project.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32 text-white md:px-8 md:pt-36">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-200">Edit Project #{projectId}</h1>
          <Link
            href="/xyzseemsxyz/projects_admin"
            className="rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-300">Loading project...</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Project title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 outline-none focus:border-cyan-300"
            />
            <textarea
              rows={6}
              placeholder="Project description"
              value={form.discription}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, discription: event.target.value }))
              }
              className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 outline-none focus:border-cyan-300"
            />
            <input
              type="url"
              placeholder="Live link (optional)"
              value={form.live_link}
              onChange={(event) => setForm((prev) => ({ ...prev, live_link: event.target.value }))}
              className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 outline-none focus:border-cyan-300"
            />

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-900 hover:bg-cyan-200 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Project'}
            </button>

            {status.message && (
              <p className={status.type === 'success' ? 'text-emerald-300' : 'text-red-300'}>
                {status.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

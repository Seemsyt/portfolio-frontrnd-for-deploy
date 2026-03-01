'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authenticatedRequest, verifyDashboardAccess } from '@/app/lib/dashboardAuth';

type PricingForm = {
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

export default function EditPricingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pricingId = params?.id;
  const rawApiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/';
  const baseUrl = rawApiBase.replace(/\/+$/, '');

  const [form, setForm] = useState<PricingForm>({
    title: '',
    price: '',
    slug: '',
    is_admin: '',
    feature_1: '',
    feature_2: '',
    feature_3: '',
    feature_4: '',
    feature_5: '',
    feature_6: '',
  });
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: '' | 'success' | 'error'; message: string }>({
    type: '',
    message: '',
  });

  useEffect(() => {
    const fetchPricing = async () => {
      if (!pricingId) return;
      const accessResult = await verifyDashboardAccess(baseUrl);
      if (!accessResult.allowed) {
        router.replace('/login?next=/xyzseemsxyz/projects_admin');
        return;
      }

      try {
        setCheckingAccess(false);
        setLoading(true);
        const response = await authenticatedRequest(baseUrl, { method: 'get', url: `/pricing/${pricingId}/` }, { includeDashboardKey: true });
        const data = response.data || {};
        setForm({
          title: data.title || '',
          price: String(data.price ?? ''),
          slug: data.slug || '',
          is_admin: data.is_admin || '',
          feature_1: data.feature_1 || '',
          feature_2: data.feature_2 || '',
          feature_3: data.feature_3 || '',
          feature_4: data.feature_4 || '',
          feature_5: data.feature_5 || '',
          feature_6: data.feature_6 || '',
        });
      } catch {
        setStatus({ type: 'error', message: 'Failed to load pricing plan.' });
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [baseUrl, pricingId, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pricingId) return;
    if (!form.title.trim() || !form.slug.trim() || !form.price.trim()) {
      setStatus({ type: 'error', message: 'Title, slug and price are required.' });
      return;
    }

    try {
      setSaving(true);
      setStatus({ type: '', message: '' });
      await authenticatedRequest(
        baseUrl,
        {
          method: 'patch',
          url: `/pricing/${pricingId}/`,
          data: {
          title: form.title.trim(),
          price: Number(form.price),
          slug: form.slug.trim(),
          is_admin: form.is_admin.trim(),
          feature_1: form.feature_1.trim(),
          feature_2: form.feature_2.trim(),
          feature_3: form.feature_3.trim(),
          feature_4: form.feature_4.trim(),
          feature_5: form.feature_5.trim(),
          feature_6: form.feature_6.trim(),
          },
        },
        { includeDashboardKey: true }
      );
      setStatus({ type: 'success', message: 'Pricing plan updated successfully.' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to update pricing plan.' });
    } finally {
      setSaving(false);
    }
  };

  if (checkingAccess) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32 text-white md:px-8 md:pt-36">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <span className="mr-3 inline-block h-4 w-4 animate-spin rounded-full border-2 border-cyan-200 border-t-transparent" />
          Checking dashboard access...
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32 text-white md:px-8 md:pt-36">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-200">Edit Pricing #{pricingId}</h1>
          <Link
            href="/xyzseemsxyz/projects_admin"
            className="rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-300">Loading pricing plan...</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Plan title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 outline-none focus:border-cyan-300"
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 outline-none focus:border-cyan-300"
              />
              <input
                type="text"
                placeholder="Slug"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 outline-none focus:border-cyan-300"
              />
            </div>
            <input
              type="text"
              placeholder="is_admin value"
              value={form.is_admin}
              onChange={(event) => setForm((prev) => ({ ...prev, is_admin: event.target.value }))}
              className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 outline-none focus:border-cyan-300"
            />

            <div className="grid grid-cols-1 gap-3">
              {(['feature_1', 'feature_2', 'feature_3', 'feature_4', 'feature_5', 'feature_6'] as const).map(
                (featureKey, index) => (
                  <input
                    key={featureKey}
                    type="text"
                    placeholder={`Feature ${index + 1}`}
                    value={form[featureKey]}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, [featureKey]: event.target.value }))
                    }
                    className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 outline-none focus:border-cyan-300"
                  />
                )
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-900 hover:bg-cyan-200 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Pricing'}
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

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authenticatedRequest } from "@/app/lib/dashboardAuth";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL ||
    "https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/").replace(/\/+$/, "") +
  "/";

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      if (!token && !refresh) {
        setError("You need to login to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const response = await authenticatedRequest(API_BASE, {
          method: "get",
          url: "/profile/",
        });
        setData(response.data);
        setError("");
      } catch (err) {
        setData(null);
        setError(err?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  const isAdmin = useMemo(() => {
    if (!data) return false;
    return Boolean(data.is_superuser || data.is_staff);
  }, [data]);

  if (loading) {
    return (
      <section className="mx-auto mt-28 w-[92vw] max-w-3xl rounded-3xl border border-white/20 bg-black/35 p-8 text-white shadow-xl backdrop-blur-md">
        <p className="text-sm text-slate-300">Loading profile...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto mt-28 w-[92vw] max-w-3xl rounded-3xl border border-red-400/30 bg-red-500/10 p-8 text-white shadow-xl backdrop-blur-md">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-3 text-sm text-red-100">{error}</p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex rounded-xl border border-white/40 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-slate-900"
          >
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-28 w-[92vw] max-w-3xl rounded-3xl border border-white/20 bg-black/35 p-8 text-white shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="mt-1 text-sm text-slate-300">Signed in account details</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <Link
              href="/xyzseemsxyz/projects_admin"
              className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200"
            >
              Open Dashboard
            </Link>
          )}
          <Link
            href="/projects"
            className="rounded-xl border border-white/40 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-slate-900"
          >
            View Projects
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">User ID</p>
          <p className="mt-2 text-lg font-semibold">{data.id}</p>
        </article>

        <article className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Username</p>
          <p className="mt-2 text-lg font-semibold">{data.username}</p>
        </article>

        <article className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
          <p className="mt-2 text-lg font-semibold break-all">{data.email}</p>
        </article>

        <article className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
          <p className="mt-2 text-lg font-semibold">
            {isAdmin ? "Admin" : "Standard User"}
          </p>
        </article>
      </div>

      {data.message && (
        <p className="mt-6 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-200">
          {data.message}
        </p>
      )}
    </section>
  );
}

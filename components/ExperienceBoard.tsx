"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Experience } from "@/lib/db";

type FormState = {
  id: number | null;
  type: "plugin" | "server";
  title: string;
  description: string;
  link: string;
  image_url: string;
  tags: string;
  sort_order: number;
};

const EMPTY_FORM: FormState = {
  id: null,
  type: "plugin",
  title: "",
  description: "",
  link: "",
  image_url: "",
  tags: "",
  sort_order: 0,
};

export default function ExperienceBoard({
  initialExperiences,
}: {
  initialExperiences: Experience[];
}) {
  const { data: session, status } = useSession();
  const [experiences, setExperiences] = useState(initialExperiences);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isAdmin = status === "authenticated";

  async function refresh() {
    const res = await fetch("/api/experiences");
    setExperiences(await res.json());
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "upload failed");
        return;
      }
      const { url } = await res.json();
      setForm((f) => ({ ...f, image_url: url }));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        type: form.type,
        title: form.title,
        description: form.description,
        link: form.link,
        image_url: form.image_url,
        tags: form.tags,
        sort_order: form.sort_order,
      };
      const url = form.id ? `/api/experiences/${form.id}` : "/api/experiences";
      const method = form.id ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this entry?")) return;
    setBusy(true);
    try {
      await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  function edit(exp: Experience) {
    setForm({
      id: exp.id,
      type: exp.type,
      title: exp.title,
      description: exp.description,
      link: exp.link ?? "",
      image_url: exp.image_url ?? "",
      tags: exp.tags,
      sort_order: exp.sort_order,
    });
    setShowForm(true);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="mt-1 text-sm text-neutral-400">Plugins I own and servers I&apos;ve worked at</p>
        </div>
        {isAdmin ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setForm(EMPTY_FORM);
                setShowForm(true);
              }}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              + Add
            </button>
            <button
              onClick={() => signOut()}
              className="rounded-lg border border-border px-4 py-2 text-sm text-neutral-300 hover:bg-surface"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="rounded-lg border border-border px-4 py-2 text-sm text-neutral-300 hover:bg-surface"
          >
            Sign in
          </button>
        )}
      </header>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="mb-10 space-y-4 rounded-xl border border-border bg-surface p-6"
        >
          <div className="flex gap-4">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "plugin" | "server" })}
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            >
              <option value="plugin">Plugin</option>
              <option value="server">Server</option>
            </select>
            <input
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              type="number"
              placeholder="Sort order"
              className="w-32 rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
          </div>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            required
            rows={3}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
          <input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="Link (optional)"
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-3">
            {form.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image_url}
                alt=""
                className="h-12 w-12 rounded-lg border border-border object-cover"
              />
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileSelect}
              disabled={uploading}
              className="text-sm text-neutral-400 file:mr-3 file:rounded-lg file:border file:border-border file:bg-bg file:px-3 file:py-1.5 file:text-sm file:text-neutral-300"
            />
            {uploading && <span className="text-xs text-neutral-500">uploading…</span>}
          </div>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Tags, comma separated"
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
          <div className="flex gap-3">
            <button
              disabled={busy}
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {form.id ? "Save" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_FORM);
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm text-neutral-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-xl border border-border bg-surface p-5 transition hover:border-accent/50"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {exp.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={exp.image_url}
                    alt=""
                    className="h-8 w-8 rounded-md border border-border object-cover"
                  />
                )}
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  {exp.type}
                </span>
              </div>
              {isAdmin && (
                <div className="flex gap-2 text-xs text-neutral-400">
                  <button onClick={() => edit(exp)} className="hover:text-white">
                    edit
                  </button>
                  <button onClick={() => remove(exp.id)} className="hover:text-red-400">
                    delete
                  </button>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold">
              {exp.link ? (
                <a href={exp.link} target="_blank" rel="noreferrer" className="hover:text-accent">
                  {exp.title}
                </a>
              ) : (
                exp.title
              )}
            </h3>
            <p className="mt-1 text-sm text-neutral-400">{exp.description}</p>
            {exp.tags && (
              <div className="mt-3 flex flex-wrap gap-2">
                {exp.tags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2 py-0.5 text-xs text-neutral-400"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {experiences.length === 0 && (
          <p className="text-sm text-neutral-500">No entries yet.</p>
        )}
      </div>
    </main>
  );
}

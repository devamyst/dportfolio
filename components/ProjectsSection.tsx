"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Check, Copy, ExternalLink, Github, MessageCircle, Pencil, Plus, Trash2 } from "lucide-react";
import type { Experience } from "@/lib/db";
import { withProtocol } from "@/lib/url";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import DateRangeBar from "./DateRangeBar";
import EntryLogo from "./EntryLogo";

type FormState = {
  id: number | null;
  title: string;
  description: string;
  link: string;
  image_url: string;
  tags: string;
  sort_order: number;
  role: string;
  server_ip: string;
  discord_url: string;
  start_date: string;
  end_date: string;
  status: string;
};

function IpChip({ ip }: { ip: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(ip);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-neutral-300 hover:border-accent hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : ip}
    </button>
  );
}

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  description: "",
  link: "",
  image_url: "",
  tags: "",
  sort_order: 0,
  role: "",
  server_ip: "",
  discord_url: "",
  start_date: "",
  end_date: "",
  status: "",
};

export default function ProjectsSection({
  initialExperiences,
  filterType,
  heading,
}: {
  initialExperiences: Experience[];
  filterType: "plugin" | "server";
  heading: string;
}) {
  const { status } = useSession();
  const [experiences, setExperiences] = useState(initialExperiences);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isAdmin = status === "authenticated";
  const visible = experiences.filter((e) => e.type === filterType);

  async function refresh() {
    const res = await fetch("/api/experiences");
    setExperiences(await res.json());
  }

  async function uploadFile(file: File): Promise<string | null> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error ?? "upload failed");
      return null;
    }
    const { url } = await res.json();
    return url;
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) setForm((f) => ({ ...f, image_url: url }));
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
        type: filterType,
        title: form.title,
        description: form.description,
        link: form.link,
        image_url: form.image_url,
        tags: form.tags,
        sort_order: form.sort_order,
        role: form.role,
        rating: null,
        review_screenshot_url: null,
        server_ip: form.server_ip,
        discord_url: form.discord_url,
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
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
      title: exp.title,
      description: exp.description,
      link: exp.link ?? "",
      image_url: exp.image_url ?? "",
      tags: exp.tags,
      sort_order: exp.sort_order,
      role: exp.role ?? "",
      server_ip: exp.server_ip ?? "",
      discord_url: exp.discord_url ?? "",
      start_date: exp.start_date ?? "",
      end_date: exp.end_date ?? "",
      status: exp.status ?? "",
    });
    setShowForm(true);
  }

  return (
    <section className="mx-auto mb-24 max-w-5xl px-6">
      <Reveal>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{heading}</h2>
          {isAdmin && (
            <button
              onClick={() => {
                setForm(EMPTY_FORM);
                setShowForm(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>
      </Reveal>

      {showForm && (
        <Reveal>
          <form onSubmit={submitForm} className="glass mb-10 space-y-4 rounded-2xl p-6">
            <input
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              type="number"
              placeholder="Sort order"
              className="w-32 rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
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
              placeholder={filterType === "server" ? "Description (optional)" : "Description"}
              required={filterType !== "server"}
              rows={3}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
            {filterType === "server" && (
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Role (e.g. Developer, Owner)"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              />
            )}
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="Website / link (optional)"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
            {filterType === "server" && (
              <input
                value={form.server_ip}
                onChange={(e) => setForm({ ...form, server_ip: e.target.value })}
                placeholder="Server IP (e.g. play.example.com)"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              />
            )}
            {filterType === "server" && (
              <input
                value={form.discord_url}
                onChange={(e) => setForm({ ...form, discord_url: e.target.value })}
                placeholder="Discord invite (optional)"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              />
            )}
            {filterType === "server" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-neutral-400">Started</label>
                  <input
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    type="month"
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-neutral-400">
                    Ended (blank = still going)
                  </label>
                  <input
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    type="month"
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
            {filterType === "server" && (
              <input
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                placeholder="Status (e.g. Active, Resigned, Removed)"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              />
            )}

            <div>
              <label className="mb-1 block text-xs text-neutral-400">Image</label>
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
        </Reveal>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {visible.map((exp, i) => {
          const isGithub = exp.link?.includes("github.com");
          return (
            <Reveal key={exp.id} delay={i * 0.05}>
              <TiltCard className="glass glow-border flex h-full flex-col overflow-hidden rounded-2xl">
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <EntryLogo title={exp.title} url={exp.image_url} />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          {exp.role && (
                            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                              {exp.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex shrink-0 gap-3 text-neutral-400">
                        <button onClick={() => edit(exp)} className="hover:text-white">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => remove(exp.id)} className="hover:text-red-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  {exp.description && (
                    <p className="mt-1 flex-1 text-sm text-neutral-400">{exp.description}</p>
                  )}
                  {exp.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.tags.split(",").filter(Boolean).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border px-2 py-0.5 text-xs text-neutral-400"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <DateRangeBar start={exp.start_date} end={exp.end_date} status={exp.status} />
                  <div className="flex flex-wrap gap-3">
                    {exp.link && (
                      <a
                        href={withProtocol(exp.link)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-neutral-300 hover:border-accent hover:text-white"
                      >
                        {isGithub ? <Github className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                        {isGithub ? "GitHub" : "Website"}
                      </a>
                    )}
                    {exp.server_ip && <IpChip ip={exp.server_ip} />}
                    {exp.discord_url && (
                      <a
                        href={withProtocol(exp.discord_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-neutral-300 hover:border-accent hover:text-white"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> Discord
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
        {visible.length === 0 && (
          <p className="text-sm text-neutral-500">No entries yet.</p>
        )}
      </div>
    </section>
  );
}

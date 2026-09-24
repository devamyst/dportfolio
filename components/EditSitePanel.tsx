"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Pencil, Save, X } from "lucide-react";
import type { Settings } from "@/lib/settings";

const FIELDS: { key: keyof Settings; label: string; textarea?: boolean }[] = [
  { key: "hero_title", label: "Hero title" },
  { key: "hero_subtitle", label: "Hero subtitle" },
  { key: "hero_description", label: "Hero description", textarea: true },
  { key: "profile_bio_1", label: "Profile bio (paragraph 1)", textarea: true },
  { key: "profile_bio_2", label: "Profile bio (paragraph 2)", textarea: true },
  { key: "stat_downloads", label: "Stat: Downloads" },
  { key: "stat_years", label: "Stat: Years Experience" },
  { key: "skills", label: "Skills (comma separated)", textarea: true },
  { key: "social_github", label: "GitHub URL" },
  { key: "social_discord", label: "Discord URL" },
  { key: "social_email", label: "Contact email" },
];

export default function EditSitePanel({
  settings,
  onUpdate,
}: {
  settings: Settings;
  onUpdate: (s: Settings) => void;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);

  if (status !== "authenticated") return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      onUpdate(updated);
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto mb-8 max-w-3xl px-6 text-right">
      <button
        onClick={() => {
          setForm(settings);
          setOpen((v) => !v);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-neutral-300 hover:bg-surface"
      >
        {open ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        {open ? "Close" : "Edit Site"}
      </button>

      {open && (
        <form
          onSubmit={submit}
          className="glass glow-border mt-4 space-y-4 rounded-2xl p-6 text-left"
        >
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-xs text-neutral-400">{field.label}</label>
              {field.textarea ? (
                <textarea
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                />
              ) : (
                <input
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}
          <button
            disabled={busy}
            type="submit"
            className="mc-btn px-4 py-2 text-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Save changes
          </button>
        </form>
      )}
    </div>
  );
}

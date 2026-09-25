"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Review } from "@/lib/db";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

type FormState = {
  id: number | null;
  author: string;
  text: string;
  sort_order: number;
};

const EMPTY_FORM: FormState = { id: null, author: "", text: "", sort_order: 0 };

export default function ReviewsSection({ initialReviews }: { initialReviews: Review[] }) {
  const { status } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const isAdmin = status === "authenticated";

  async function refresh() {
    const res = await fetch("/api/reviews");
    setReviews(await res.json());
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        author: form.author.trim() || null,
        text: form.text,
        sort_order: form.sort_order,
      };
      const url = form.id ? `/api/reviews/${form.id}` : "/api/reviews";
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
    if (!confirm("Delete this review?")) return;
    setBusy(true);
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  function edit(review: Review) {
    setForm({
      id: review.id,
      author: review.author ?? "",
      text: review.text,
      sort_order: review.sort_order,
    });
    setShowForm(true);
  }

  return (
    <section className="mx-auto mb-24 max-w-5xl px-6">
      <Reveal>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Reviews</h2>
            <p className="mt-1 text-sm text-neutral-400">What people say about working with me.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setForm(EMPTY_FORM);
                setShowForm(true);
              }}
              className="mc-btn px-4 py-2 text-sm disabled:opacity-50"
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
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Author (optional)"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Review text"
              required
              rows={4}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
            <div className="flex gap-3">
              <button
                disabled={busy}
                type="submit"
                className="mc-btn px-4 py-2 text-sm disabled:opacity-50"
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.id} delay={(i % 3) * 0.05}>
            <TiltCard className="mc-tooltip relative flex h-full flex-col overflow-hidden p-6">
              <span className="font-pixel text-sm text-accent2">★★★★★</span>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-300">{r.text}</p>
              {(r.author || isAdmin) && (
                <div className="mt-5 flex items-center justify-between border-t-2 border-enchant/20 pt-4">
                  <span className="font-pixel text-sm text-enchant">{r.author}</span>
                  {isAdmin && (
                    <div className="flex shrink-0 gap-3 text-neutral-400">
                      <button onClick={() => edit(r)} className="hover:text-white">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => remove(r.id)} className="hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </TiltCard>
          </Reveal>
        ))}
        {reviews.length === 0 && <p className="text-sm text-neutral-500">No reviews yet.</p>}
      </div>
    </section>
  );
}

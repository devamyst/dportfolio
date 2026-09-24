"use client";

import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

export default function AuthControl() {
  const { status } = useSession();
  const isAdmin = status === "authenticated";
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [creds, setCreds] = useState({ username: "", password: "" });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await signIn("credentials", {
        username: creds.username,
        password: creds.password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid username or password");
      } else {
        setOpen(false);
        setCreds({ username: "", password: "" });
      }
    } finally {
      setBusy(false);
    }
  }

  if (isAdmin) {
    return (
      <button
        onClick={() => signOut()}
        className="mc-btn px-3 py-1.5 text-sm"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    );
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mc-btn px-3 py-1.5 text-sm"
      >
        <LogIn className="h-4 w-4" /> Sign in
      </button>
      {open && (
        <form
          onSubmit={submit}
          className="glass absolute right-0 top-12 z-20 w-64 space-y-3 rounded-xl p-4"
        >
          <input
            value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
            placeholder="Username"
            autoComplete="username"
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
          <input
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            disabled={busy}
            type="submit"
            className="mc-btn w-full px-3 py-2 text-sm disabled:opacity-50"
          >
            Sign in
          </button>
        </form>
      )}
    </div>
  );
}

"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const signup = mode === "signup";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    try {
      const supabase = createClient();
      const result = signup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        setError(signup ? "Could not create your account. Use a valid email and a password of at least 8 characters; try again later if needed." : "Could not sign in. Check your email, password and email confirmation, then try again.");
      } else if (result.data.session) {
        // Full navigation discards any previous account's client-side router cache.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Discard cached data from any previous account after browser-side Auth changes cookies.
        window.location.assign("/notes");
      } else {
        setMessage("Check your email for a confirmation link, then sign in. If you already have an account, use Sign in.");
      }
    } catch {
      setError("Authentication is unavailable. Check your connection and try again.");
    } finally { setPending(false); }
  }
  return <main className="auth-shell"><section className="card w-full max-w-md">
    <Link href="/login" className="brand">Private Notes</Link>
    <h1 className="mt-8 text-3xl font-semibold tracking-tight">{signup ? "A space for your thoughts." : "Welcome back."}</h1>
    <p className="mt-3 text-slate-600">{signup ? "Create an account to keep your notes in one place." : "Sign in to your personal notebook."}</p>
    <form onSubmit={submit} className="mt-8 space-y-5">
      <label className="field">Email<input name="email" type="email" autoComplete="email" required maxLength={254} disabled={pending} /></label>
      <label className="field">Password<input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} required minLength={signup ? 8 : undefined} disabled={pending} /></label>
      {signup && <p className="text-sm text-slate-600">Use at least 8 characters.</p>}
      {error && <p role="alert" className="error">{error}</p>}
      {message && <p role="status" className="notice">{message}</p>}
      <button className="button w-full" disabled={pending}>{pending ? "Please wait…" : signup ? "Create account" : "Sign in"}</button>
    </form>
    <p className="mt-6 text-sm text-slate-600">{signup ? "Already have an account? " : "New here? "}<Link className="text-link" href={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Create an account"}</Link></p>
  </section></main>;
}

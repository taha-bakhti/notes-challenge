"use client";
import Link from "next/link";
import { NotebookMark } from "@/components/ui/notebook-mark";
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
  return (
    <main className="auth-shell">
      <Link href="/login" className="brand auth-brand"><NotebookMark />Private Notes</Link>
      <section className="card auth-card" aria-labelledby="auth-title">
        <p className="eyebrow">Your personal notebook</p>
        <h1 id="auth-title" className="auth-heading">{signup ? "Make room for your ideas." : "Welcome back."}</h1>
        <p className="muted mt-3 text-sm">{signup ? "Create an account. Give your thoughts a place to land." : "Sign in to pick up where you left off."}</p>
        <form onSubmit={submit} className="mt-8 space-y-5" aria-busy={pending}>
          <label className="field">Email address
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} disabled={pending} />
          </label>
          <label className="field">Password
            <input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} placeholder={signup ? "Create a password" : "Enter your password"} required minLength={signup ? 8 : undefined} disabled={pending} aria-describedby={signup ? "password-hint" : undefined} />
          </label>
          {signup && <p id="password-hint" className="field-hint">Use at least 8 characters.</p>}
          {error && <p role="alert" className="error">{error}</p>}
          {message && <p role="status" className="notice">{message}</p>}
          <button className="button w-full" disabled={pending}>{pending ? "Please wait…" : signup ? "Create account" : "Sign in"}</button>
        </form>
        <p className="muted mt-8 border-t border-[var(--line)] pt-6 text-center text-sm">
          {signup ? "Already have an account? " : "New to Private Notes? "}
          <Link className="text-link inline-flex min-h-11 items-center" href={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Create an account"}</Link>
        </p>
      </section>
      <p className="auth-footer">A little space. A clearer mind.</p>
    </main>
  );
}

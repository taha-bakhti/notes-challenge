"use client";
import { useState, useTransition } from "react";
import { signOut } from "@/app/auth/actions";
export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return <div><button className="button-secondary" disabled={pending} onClick={() => {
    setError("");
    startTransition(async () => {
      try { const result = await signOut(); if (result?.error) setError(result.error); }
      catch { setError("Sign-out could not finish. Please try again."); }
    });
  }}>{pending ? "Signing out…" : "Sign out"}</button>{error && <p role="alert" className="error mt-2">{error}</p>}</div>;
}

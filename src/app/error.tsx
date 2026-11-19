"use client";
import { NotebookMark } from "@/components/ui/notebook-mark";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="auth-shell">
      <p className="brand auth-brand"><NotebookMark />Private Notes</p>
      <section className="card auth-card" aria-labelledby="error-title">
        <p className="eyebrow">Let’s try that again</p>
        <h1 id="error-title" className="auth-heading">A little interruption.</h1>
        <p className="muted mt-4">Something went wrong while loading this page. The service may be temporarily unavailable.</p>
        <button className="button mt-8 w-full" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}

"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="auth-shell"><section className="card"><h1 className="text-2xl font-semibold">Something went wrong.</h1><p className="my-4 text-slate-600">The service may be unavailable. Please try again.</p><button className="button" onClick={reset}>Try again</button></section></main>;
}

import { NotebookMark } from "@/components/ui/notebook-mark";

export default function Loading() {
  return (
    <div className="app-shell">
      <header className="app-header"><p className="brand"><NotebookMark />Private Notes</p></header>
      <main role="status" aria-busy="true" aria-label="Loading your notebook">
        <div className="page-intro">
          <p className="eyebrow">Your notebook</p>
          <h1 className="page-title">Room for your thoughts.</h1>
          <p className="muted mt-3">Loading your notebook…</p>
        </div>
        <div className="workspace" aria-hidden="true">
          <div className="card space-y-6">
            <div className="skeleton h-6 w-28" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-12" />
            <div className="skeleton h-52" />
            <div className="skeleton h-12" />
          </div>
          <div className="min-w-0">
            <div className="skeleton mb-5 h-7 w-28" />
            <div className="notes-grid">
              {[0, 1].map(item => <div key={item} className="card space-y-5"><div className="skeleton h-5 w-1/2" /><div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-4/5" /><div className="skeleton h-3 w-2/3" /><div className="skeleton h-3 w-1/2" /></div>)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

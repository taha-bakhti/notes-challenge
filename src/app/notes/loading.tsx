import { NotebookMark } from "@/components/ui/notebook-mark";

export default function Loading() {
  return (
    <div className="app-shell">
      <header className="app-header"><p className="brand"><NotebookMark />Private Notes</p></header>
      <main className="notebook-main" role="status" aria-busy="true" aria-label="Loading your notebook">
        <span className="sr-only">Loading your notebook…</span>
        <div className="notebook-workspace" data-mobile-pane="workspace" aria-hidden="true">
          <div className="notes-sidebar">
            <div className="sidebar-heading space-y-5">
              <div className="skeleton h-6 w-28" />
            </div>
          </div>
          <div className="writing-workspace">
            <div className="workspace-empty">
              <div className="skeleton h-10 w-10" />
              <div className="skeleton h-4 w-48" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

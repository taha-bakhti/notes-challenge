import type { Metadata } from "next";
import { NotebookMark } from "@/components/ui/notebook-mark";
import type { Database } from "@/types/database";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoteForm } from "@/components/notes/note-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your notes" };
export default async function Notes() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");
  // TODO(notes): After the notes migration and SELECT RLS policy exist, replace
  // these placeholders with the authenticated client's query result (data/error).
  // Retrieve this user's notes newest first; database RLS must enforce ownership.
  // Keep the existing empty and error states when wiring in the result.
  const notes: Database["public"]["Tables"]["notes"]["Row"][] = [];
  const error = null;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#notebook">Skip to notebook</a>
      <header className="app-header">
        <p className="brand"><NotebookMark />Private Notes</p>
        <div className="account"><p className="account-email">{user.email}</p><SignOutButton /></div>
      </header>
      <main id="notebook" tabIndex={-1}>
        <div className="page-intro">
          <p className="eyebrow">Your notebook</p>
          <h1 className="page-title">Room for your thoughts.</h1>
          <p className="muted mt-3">A quiet place to collect ideas, one note at a time.</p>
        </div>
        <div className="workspace">
          <NoteForm />
          <section aria-labelledby="notes-heading" className="min-w-0">
            <div className="section-heading">
              <h2 id="notes-heading" className="section-title">Your notes</h2>
              {!error && <span className="note-count" aria-label={`${notes.length} notes`}>{notes.length}</span>}
            </div>
            {error ? (
              <div role="alert" className="error">
                <p className="font-semibold">Your notes couldn’t be loaded.</p>
                <p className="mt-1">Refresh the page to try again.</p>
                <a href="/notes" className="text-link mt-3 inline-flex min-h-11 items-center">Reload notebook</a>
              </div>
            ) : notes?.length ? (
              <ul className="notes-grid">
                {notes.map(note => (
                  <li key={note.id}>
                    <article className="card note-card">
                      <h3 className="section-title">{note.title}</h3>
                      <p className="muted mt-3 whitespace-pre-wrap text-sm leading-7">{note.content}</p>
                      <time className="note-date" dateTime={note.created_at}>
                        {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(note.created_at))} UTC
                      </time>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <NotebookMark />
                <h3 className="section-title">Good ideas start with a note.</h3>
                <p className="muted mt-2 text-sm">A passing thought, a useful detail, your next big idea. Keep it here.</p>
                <a href="#note-title" className="text-link mt-5 inline-flex min-h-11 items-center text-sm">Write your first note <span aria-hidden="true" className="ml-2">→</span></a>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Database } from "@/types/database";
import { createNote, type NoteState } from "@/app/notes/actions";
import { NoteForm } from "@/components/notes/note-form";
import { NotebookMark } from "@/components/ui/notebook-mark";
import { SignOutButton } from "@/components/auth/sign-out-button";

type Note = Database["public"]["Tables"]["notes"]["Row"];
type WorkspaceMode = "idle" | "creating" | "reading";
const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" });

export function NotesWorkspace({ notes, hasLoadError, email }: { notes: Note[]; hasLoadError: boolean; email?: string }) {
  const [mode, setMode] = useState<WorkspaceMode>("idle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<"list" | "workspace">("workspace");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [draftDate, setDraftDate] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const workspaceRef = useRef<HTMLElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const navbarActionRef = useRef<HTMLButtonElement>(null);
  const selectedNote = notes.find(note => note.id === selectedId);
  const hasDraft = Boolean(title || content);

  const [state, action, pending] = useActionState<NoteState, FormData>(async (previous, formData) => {
    // Only the existing Server Action can confirm persistence.
    let result: NoteState;
    try {
      result = await createNote(previous, formData);
    } catch {
      return { error: "Could not save your note. Please try again." };
    }
    if (result.success) {
      setTitle("");
      setContent("");
      setDraftDate(null);
      setSelectedId(null);
      setMode("idle");
      setSuccess(result.success);
    }
    return result;
  }, {});

  useEffect(() => {
    if (success && !pending) navbarActionRef.current?.focus();
  }, [success, pending]);

  useEffect(() => {
    if (!hasDraft) return;
    function protectDraft(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", protectDraft);
    return () => window.removeEventListener("beforeunload", protectDraft);
  }, [hasDraft]);

  function focusWritingArea() {
    requestAnimationFrame(() => {
      workspaceRef.current?.scrollTo({ top: 0 });
      workspaceRef.current?.querySelector<HTMLElement>("[data-writing-focus]")?.focus();
    });
  }

  function compose() {
    setSelectedId(null);
    setMode("creating");
    setSuccess("");
    // Reopening compose resumes the in-memory draft, including its date.
    if (!draftDate) setDraftDate(new Date().toISOString());
    setMobilePane("workspace");
    focusWritingArea();
  }

  function showList() {
    setMode("idle");
    setSelectedId(null);
    setMobilePane("list");
    requestAnimationFrame(() => listHeadingRef.current?.focus());
  }

  const creating = mode === "creating";
  const actionLabel = creating ? (pending ? "Saving note…" : "Save note") : (hasDraft ? "Resume unsaved note" : "Create a note");

  return (
    <div className="app-shell">
      <a className="skip-link" href="#notebook">Skip to notebook</a>
      <header className="app-header">
        <p className="brand"><NotebookMark />Private Notes</p>
        <button ref={navbarActionRef} className="notebook-control navbar-note-action"
          type={creating ? "submit" : "button"} form={creating ? "new-note-form" : undefined}
          onClick={creating ? undefined : compose}
          disabled={pending || (creating && (!title.trim() || !content.trim()))}
          aria-label={actionLabel} title={actionLabel} aria-busy={pending}>
          {creating ? <SaveIcon /> : <ComposeIcon />}
        </button>
        <div className="account" onClickCapture={event => {
          if (!(event.target instanceof Element) || !event.target.closest("button")) return;
          if (pending || (hasDraft && !window.confirm("Sign out and discard your unsaved note?"))) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}>
          <p className="account-email">{email}</p><SignOutButton />
        </div>
      </header>
      <main id="notebook" className="notebook-main" tabIndex={-1}>
        <p className="sr-only" role="status">{pending ? "Saving note…" : success}</p>
        <div className="notebook-workspace" data-mobile-pane={mobilePane}>
          <aside className="notes-sidebar" aria-labelledby="notes-heading">
            <div className="sidebar-heading">
              <div className="notes-heading-row">
                <h1 id="notes-heading" ref={listHeadingRef} tabIndex={-1}>All notes</h1>
                {!hasLoadError && <span className="note-count" aria-label={`${notes.length} notes`}>{notes.length}</span>}
              </div>
            </div>
            <div className="notes-list-scroll">
              {hasLoadError ? (
                <div role="alert" className="error sidebar-message">
                  <p>Your notes couldn’t be loaded.</p>
                  <a href="/notes" className="text-link inline-flex min-h-11 items-center" onClick={event => {
                    if (hasDraft && !window.confirm("Reload and discard your unsaved note?")) event.preventDefault();
                  }}>Reload notebook</a>
                </div>
              ) : notes.length ? (
                <ul className="notes-list">
                  {notes.map(note => (
                    <li key={note.id}>
                      <button className="note-list-item" aria-current={selectedId === note.id ? "true" : undefined}
                        disabled={pending} onClick={() => {
                          setSelectedId(note.id);
                          setMode("reading");
                          setSuccess("");
                          setMobilePane("workspace");
                          focusWritingArea();
                        }}>
                        <span className="note-list-title">{note.title}</span>
                        <time className="note-list-date" dateTime={note.created_at}>{dateFormatter.format(new Date(note.created_at))}</time>
                        <span className="note-list-preview">{note.content.replace(/\s+/g, " ").trim()}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p className="notes-empty">No notes yet.</p>}
            </div>
          </aside>
          <section className="writing-workspace" ref={workspaceRef} aria-label={creating ? "Write a new note" : mode === "reading" ? "Read note" : "Notebook"}>
            <div className="workspace-toolbar">
              <button className="notebook-control mobile-back" onClick={showList} disabled={pending} aria-label="Back to all notes">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
                All notes
              </button>
            </div>
            {mode === "idle" && (
              <div className="workspace-empty">
                <NotebookMark />
                <h2>Every idea starts somewhere.</h2>
                {notes.length > 0 && <p>Select a note or create a new one.</p>}
                <button className="notebook-control" onClick={compose}>{hasDraft ? "Resume your note" : "Create a note"}</button>
                {success && <p className="save-confirmation">{success}</p>}
              </div>
            )}
            {mode === "reading" && selectedNote && (
              <article className="writing-area read-note" key={selectedNote.id}>
                <time className="document-date" dateTime={selectedNote.created_at}>{dateFormatter.format(new Date(selectedNote.created_at))}</time>
                <h2 tabIndex={-1} data-writing-focus>{selectedNote.title}</h2>
                <p className="read-note-content">{selectedNote.content}</p>
              </article>
            )}
            <div hidden={!creating}>
              <NoteForm action={action} pending={pending} error={state.error} title={title} content={content}
                onTitleChange={setTitle} onContentChange={setContent} date={draftDate} active={creating} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ComposeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M15 5l4 4M10 14l1-5 7-7a2.8 2.8 0 0 1 4 4l-7 7-5 1Z" /></svg>;
}

function SaveIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h12l4 4v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM7 3v6h10V3M7 21v-8h10v8" /></svg>;
}

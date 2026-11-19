"use client";
import { useActionState, useState } from "react";
import { createNote, type NoteState } from "@/app/notes/actions";
export function NoteForm() {
  const [state, action, pending] = useActionState<NoteState, FormData>(createNote, {});
  return (
    <section className="card" aria-labelledby="new-note-heading">
      <h2 id="new-note-heading" className="section-title">New note</h2>
      <p className="muted mt-2 text-sm">Something worth remembering.</p>
      <form action={action} className="mt-6 space-y-5" aria-busy={pending}>
        <NoteFields key={state.resetKey ?? "initial"} pending={pending} />
        {state.error && <p role="alert" className="error">{state.error}</p>}
        {state.success && <p role="status" className="notice">{state.success}</p>}
        <button disabled={pending} className="button w-full">{pending ? "Saving…" : "Save note"}</button>
      </form>
    </section>
  );
}
function NoteFields({ pending }: { pending: boolean }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Controlled fields preserve drafts on failed actions; success remounts this component.
  return (
    <fieldset disabled={pending} className="min-w-0 space-y-5">
      <legend className="sr-only">Note details — all fields required</legend>
      <label className="field" htmlFor="note-title">Title
        <input id="note-title" name="title" required maxLength={120} value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your note a title" aria-describedby="title-hint" />
        <span id="title-hint" className="field-hint">Up to 120 characters.</span>
      </label>
      <label className="field" htmlFor="note-content">Note
        <textarea id="note-content" name="content" required maxLength={10000} rows={7} value={content} onChange={e => setContent(e.target.value)} placeholder="Start writing…" aria-describedby="content-hint" />
        <span id="content-hint" className="field-hint text-right tabular-nums">{content.length.toLocaleString("en-GB")} / 10,000 characters</span>
      </label>
    </fieldset>
  );
}

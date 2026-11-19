"use client";
import { useActionState, useState } from "react";
import { createNote, type NoteState } from "@/app/notes/actions";
export function NoteForm() {
  const [state, action, pending] = useActionState<NoteState, FormData>(createNote, {});
  return <section className="card"><h2 className="text-xl font-semibold">New note</h2><p className="mt-2 text-sm text-slate-600">Capture something you want to remember.</p>
    <form action={action} className="mt-6 space-y-5">
      <NoteFields key={state.resetKey ?? "initial"} pending={pending} />
      {state.error && <p role="alert" className="error">{state.error}</p>}
      {state.success && <p role="status" className="notice">{state.success}</p>}
      <button disabled={pending} className="button w-full">{pending ? "Saving…" : "Save note"}</button>
    </form>
  </section>;
}
function NoteFields({ pending }: { pending: boolean }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Controlled fields preserve drafts on failed actions; success remounts this component.
  return <fieldset disabled={pending} className="space-y-5">
    <label className="field">Title<input name="title" required maxLength={120} value={title} onChange={e => setTitle(e.target.value)} placeholder="A thought worth keeping" /></label>
    <label className="field">Note<textarea name="content" required maxLength={10000} rows={7} value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note…" /></label>
  </fieldset>;
}

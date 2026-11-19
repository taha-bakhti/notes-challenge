import type { Database } from "@/types/database";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoteForm } from "@/components/notes/note-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
export const dynamic = "force-dynamic";
export default async function Notes() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");
  // Intentionally unfiltered by user_id: the database applies the SELECT policy.
  const notes: Database["public"]["Tables"]["notes"]["Row"][] = [];
  const error = null; // Rehearsal: replace these two lines with the database query.
  return <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
    <header className="flex flex-wrap items-center justify-between gap-5 border-b border-slate-200 pb-7">
      <div><p className="brand">Private Notes</p><p className="mt-2 break-all text-sm text-slate-600">{user.email}</p></div><SignOutButton />
    </header>
    <div className="my-10"><p className="eyebrow">YOUR NOTEBOOK</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Room for your thoughts.</h1><p className="mt-3 text-slate-600">A quiet place to collect ideas, one note at a time.</p></div>
    <div className="grid items-start gap-8 lg:grid-cols-[340px_1fr]">
      <NoteForm />
      <section aria-label="Your notes"><h2 className="mb-5 text-xl font-semibold">Your notes</h2>
        {error ? <div role="alert" className="card error">Your notes could not be loaded. Refresh the page to try again.</div> : notes?.length ? <ul className="space-y-4">{notes.map(note => <li key={note.id} className="card">
          <article><h3 className="break-words text-xl font-semibold">{note.title}</h3><time className="mt-2 block text-sm text-slate-500" dateTime={note.created_at}>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(note.created_at))} UTC</time><p className="mt-5 whitespace-pre-wrap break-words leading-7 text-slate-700">{note.content}</p></article>
        </li>)}</ul> : <div className="rounded-2xl border border-dashed border-slate-300 px-8 py-16 text-center"><h3 className="text-lg font-medium">Your notebook starts here.</h3><p className="mt-2 text-slate-600">Save your first note using the form.</p></div>}
      </section>
    </div>
  </main>;
}

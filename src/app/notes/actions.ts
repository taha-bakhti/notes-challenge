"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
export type NoteState = { error?: string; success?: string; resetKey?: string };
export async function createNote(_previous: NoteState, form: FormData): Promise<NoteState> {
  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();
  if (!title || title.length > 120 || !content || content.length > 10000) {
    return { error: "Enter a title (1–120 characters) and note (1–10,000 characters)." };
  }
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Your session has expired. Sign in again to save your note." };
    // No user_id: PostgreSQL's auth.uid() default supplies ownership, checked by RLS.
    const error = { message: "Rehearsal: implement INSERT here" };
    if (error) return { error: "Could not save your note. Please try again." };
    revalidatePath("/notes");
    return { success: "Note saved.", resetKey: crypto.randomUUID() };
  } catch { return { error: "The service is unavailable. Please try again." }; }
}

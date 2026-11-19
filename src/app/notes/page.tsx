import type { Metadata } from "next";
import type { Database } from "@/types/database";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotesWorkspace } from "@/components/notes/notes-workspace";
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
  return <NotesWorkspace notes={notes} hasLoadError={Boolean(error)} email={user.email} />;
}

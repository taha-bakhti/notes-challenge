"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function signOut(): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: "Sign-out failed. Please try again." };
  redirect("/login");
}

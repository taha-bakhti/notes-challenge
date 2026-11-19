import { randomUUID } from "node:crypto";
import { createClient, type PostgrestError } from "@supabase/supabase-js";
import type { Database } from "../src/types/database";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}
let failures = 0;
function check(name: string, condition: boolean) {
  console.log(`${condition ? "PASS" : "FAIL"} ${name}`);
  if (!condition) failures++;
}
// 42501 is insufficient_privilege, also used for RLS WITH CHECK failures.
// Network failures, expired JWTs and missing tables must NOT count as security passes.
function denied(error: PostgrestError | null) { return error?.code === "42501"; }

async function main() {
  if (required("RLS_DISPOSABLE_CONFIRM") !== "YES") throw new Error("Disposable development environment acknowledgement required.");
  const url = required("NEXT_PUBLIC_SUPABASE_URL");
  const key = required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  if (key.startsWith("sb_secret_")) throw new Error("Privileged keys are forbidden.");
  if (!key.startsWith("sb_publishable_")) {
    const payload = JSON.parse(Buffer.from(key.split(".")[1] ?? "", "base64url").toString());
    if (payload.role !== "anon") throw new Error("Only a publishable or legacy anon key is allowed.");
  }
  const client = () => createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const a = client(); const b = client(); const anonymous = client();
  const [loginA, loginB] = await Promise.all([
    a.auth.signInWithPassword({ email: required("RLS_USER_A_EMAIL"), password: required("RLS_USER_A_PASSWORD") }),
    b.auth.signInWithPassword({ email: required("RLS_USER_B_EMAIL"), password: required("RLS_USER_B_PASSWORD") }),
  ]);
  if (loginA.error || loginB.error || !loginA.data.user || !loginB.data.user) {
    throw new Error("Account login failed. Check credentials, email confirmation and Auth availability.");
  }
  const aid = loginA.data.user.id; const bid = loginB.data.user.id;
  if (aid === bid) throw new Error("User A and User B must be different accounts.");
  const marker = `RLS-VERIFY-${randomUUID()}`;
  console.log(`Test data prefix: ${marker}`);
  const na = await a.from("notes").insert({ title: `${marker}-A`, content: "Disposable isolation test A" }).select().single();
  check("A creates a note with automatic ownership", !na.error && na.data?.user_id === aid);
  if (!na.data) throw new Error("Cannot continue without User A test note.");
  const noteA = na.data;
  const before = await b.from("notes").select("*");
  check("B cannot see A's note", !before.error && !!before.data && before.data.every(n => n.user_id === bid) && !before.data.some(n => n.id === noteA.id));
  const nb = await b.from("notes").insert({ title: `${marker}-B`, content: "Disposable isolation test B" }).select().single();
  check("B creates a note with automatic ownership", !nb.error && nb.data?.user_id === bid);
  if (!nb.data) throw new Error("Cannot continue without User B test note.");
  const noteB = nb.data;
  const [rowsA, rowsB] = await Promise.all([a.from("notes").select("*"), b.from("notes").select("*")]);
  check("A retrieves only A's notes including new note", !rowsA.error && !!rowsA.data && rowsA.data.every(n => n.user_id === aid) && rowsA.data.some(n => n.id === noteA.id) && !rowsA.data.some(n => n.id === noteB.id));
  check("B retrieves only B's notes including new note", !rowsB.error && !!rowsB.data && rowsB.data.every(n => n.user_id === bid) && rowsB.data.some(n => n.id === noteB.id) && !rowsB.data.some(n => n.id === noteA.id));
  const crossB = await b.from("notes").select("*").eq("id", noteA.id);
  check("B queries A's known note ID: zero rows", !crossB.error && crossB.data?.length === 0);
  const crossA = await a.from("notes").select("*").eq("id", noteB.id);
  check("A queries B's known note ID: zero rows", !crossA.error && crossA.data?.length === 0);
  const forged = await b.from("notes").insert({ user_id: aid, title: `${marker}-FORGED`, content: "Must be denied" });
  check("Forged ownership rejected with 42501", denied(forged.error));
  const anonRead = await anonymous.from("notes").select("*");
  check("Anonymous read denied with 42501", denied(anonRead.error));
  const anonWrite = await anonymous.from("notes").insert({ user_id: aid, title: `${marker}-ANON`, content: "Must be denied" });
  check("Anonymous insert denied with 42501", denied(anonWrite.error));
  const update = await a.from("notes").update({ title: `${marker}-UPDATED` }).eq("id", noteA.id);
  check("Owner UPDATE denied with 42501", denied(update.error));
  const deletion = await a.from("notes").delete().eq("id", noteA.id);
  check("Owner DELETE denied with 42501", denied(deletion.error));
  const retained = await a.from("notes").select("*").eq("id", noteA.id).single();
  check("Original note remains unchanged", !retained.error && retained.data?.title === `${marker}-A`);
  await Promise.all([a.auth.signOut({ scope: "local" }), b.auth.signOut({ scope: "local" })]);
  console.log(`${failures === 0 ? "PASS" : "FAIL"}: ${failures} security assertion(s) failed. Test notes retained; cleanup requires disposable local reset.`);
  process.exitCode = failures ? 1 : 0;
}
main().catch((error: unknown) => {
  console.error("FAIL", error instanceof Error ? error.message : "Verification setup failed");
  process.exitCode = 1;
});

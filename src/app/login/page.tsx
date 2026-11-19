import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
export const metadata: Metadata = { title: "Sign in" };
export default async function Login({ searchParams }: { searchParams: Promise<{ confirmation?: string }> }) {
  const params = await searchParams;
  return <>{params.confirmation === "failed" && <p role="alert" className="error p-4 text-center">Confirmation link is invalid or expired. Try signing in, or request a new confirmation through sign-up.</p>}<AuthForm mode="login" /></>;
}

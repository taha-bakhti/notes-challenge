import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  applicationName: "notes-challenge",
  title: { default: "Private Notes", template: "%s | Private Notes" },
  description: "A personal notebook project built with Next.js and Supabase.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

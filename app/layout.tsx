import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

// Bricolage Grotesque is the display face, used sparingly for page titles and
// the wordmark. IBM Plex Sans carries everything else, numbers included.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Dashboard · Sales",
    template: "%s · Sales",
  },
  description: "A modern business dashboard and CRM built with Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plexSans.variable} h-full antialiased`}
    >
      <body className="h-full font-sans text-slate-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

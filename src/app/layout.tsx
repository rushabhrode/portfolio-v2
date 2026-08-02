import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { person } from "@/content/portfolio.data";
import "./globals.css";

/* Everything structural: headings, body, buttons. */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

/* Everything measurable: numbers, dates, labels, stack lists, section indices. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(person.url),
  title: {
    default: `${person.name} — ${person.role}`,
    template: `%s — ${person.name}`,
  },
  description: person.statement,
  keywords: [
    "Rushabh Rode",
    "software engineer",
    "ML researcher",
    "IEEE",
    "backend engineer",
    "LLM",
    "RAG",
    "Pune",
    "full stack developer",
  ],
  authors: [{ name: person.name, url: person.url }],
  creator: person.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: person.url,
    siteName: person.name,
    title: `${person.name} — ${person.role}`,
    description: person.statement,
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.name} — ${person.role}`,
    description: person.statement,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full bg-bg text-text">
        {/* Synchronous and first in the body, so reveal animations are armed
            before anything paints. Deliberately not wrapped in a manual <head>
            — App Router owns that element, and adding one breaks hydration,
            which silently kills every effect on the page.

            If this script never runs, the stylesheet leaves all revealed
            content visible. Content never depends on an animation to appear. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-js','')`,
          }}
        />
        {children}
      </body>
    </html>
  );
}

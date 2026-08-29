import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MockBanner from "@/components/mock-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jan Sathi — AI Grievance Companion",
  description:
    "File government complaints in your own words. AI handles the bureaucracy. Track status in plain language. Get help escalating stalled grievances.",
  openGraph: {
    title: "Jan Sathi — AI Grievance Companion",
    description:
      "Reimagining India's public grievance system with AI. File, track, and escalate complaints — simply.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MockBanner />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}

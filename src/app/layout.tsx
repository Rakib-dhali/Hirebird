import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Hirebird - The Ultimate Job Application Tracker",
  description: "Organize your job search, track interview stages, and land your dream job with Hirebird's powerful kanban pipeline.",
  keywords: ["job application tracker", "job search", "kanban board", "career management", "interview tracker"],
  openGraph: {
    title: "Hirebird - Job Application Tracker",
    description: "Organize your job search and land your dream job.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hirebird - Job Application Tracker",
    description: "Organize your job search and land your dream job.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">{children}</body>
    </html>
  );
}

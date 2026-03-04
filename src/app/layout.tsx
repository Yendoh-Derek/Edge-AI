import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../components/ui/toast";

const geistSans = Geist({
  variable: "--font-edge-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-edge-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edge AI",
  description:
    "Edge AI — AI-powered diagnostic and remediation for JHS, SHS, and TVET learners in Ghana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ToastProvider>
          <div className="min-h-screen bg-surface text-foreground">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProjectFlow – Manage projects with ease",
  description:
    "ProjectFlow is a modern Kanban-style project management app that helps teams organize tasks, track progress, and collaborate efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#f7f9ff] text-[#181c20]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

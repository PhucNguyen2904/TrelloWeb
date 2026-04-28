"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

interface AuthSplitLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  asideTitle: string;
  asideDescription: string;
  asideContent: ReactNode;
  form: ReactNode;
  footer: ReactNode;
}

function AppMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="5" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="13" y="3" width="8" height="9" rx="1.5" fill="currentColor" />
      <rect x="3" y="10" width="8" height="11" rx="1.5" fill="currentColor" />
      <rect x="13" y="14" width="8" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export function AuthSplitLayout({
  eyebrow,
  title,
  description,
  asideTitle,
  asideDescription,
  asideContent,
  form,
  footer,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,560px)]">
        <aside className="auth-left-col relative overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#2563eb] px-12 py-10 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_24%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <Link href="/" className="inline-flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                <AppMark />
              </div>
              <div>
                <p className="text-base font-semibold">ProjectFlow</p>
                <p className="text-sm text-white/70">Production-ready collaboration</p>
              </div>
            </Link>

            <div className="max-w-xl space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">{eyebrow}</p>
                <h1 className="text-4xl font-bold leading-tight">{asideTitle}</h1>
                <p className="max-w-lg text-base leading-7 text-white/78">{asideDescription}</p>
              </div>
              <SurfaceCard className="border-white/15 bg-white/10 p-6 text-white shadow-lg backdrop-blur">
                {asideContent}
              </SurfaceCard>
            </div>

            <p className="text-sm text-white/55">Built for fast-moving teams that want clean execution visibility.</p>
          </div>
        </aside>

        <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 text-[#0f172a] lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-sm">
                <AppMark />
              </div>
              <span className="text-lg font-semibold">ProjectFlow</span>
            </Link>

            <SurfaceCard className="p-6 sm:p-8">
              <div className="mb-8 space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#64748b]">{eyebrow}</p>
                <h2 className="text-2xl font-bold text-[#0f172a]">{title}</h2>
                <p className="text-sm text-[#64748b]">{description}</p>
              </div>
              {form}
            </SurfaceCard>

            <p className="text-center text-sm text-[#64748b]">{footer}</p>
          </div>
        </main>
      </div>
    </div>
  );
}

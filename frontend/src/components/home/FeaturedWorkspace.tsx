"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Workspace } from "@/lib/types";

interface FeaturedWorkspaceProps {
  workspace: Workspace;
}

export function FeaturedWorkspace({ workspace }: FeaturedWorkspaceProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(99,102,241,0.16),rgba(17,17,24,0.92)_42%,rgba(245,158,11,0.12))] px-6 py-6 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8"
    >
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_56%)] lg:block" />
      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.12)] px-3 py-1 text-xs font-medium text-[var(--accent-warm)]">
            Featured
          </span>
          <div className="space-y-3">
            <h2 className="font-display text-4xl text-white sm:text-5xl">{workspace.name}</h2>
            <p className="max-w-xl text-sm leading-7 text-white/72 sm:text-base">Collaborate and organize your workspace</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/boards`} className="px-5 py-2 rounded-full bg-brand text-white hover:opacity-90 transition flex items-center gap-2">
              Open workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative h-[280px] overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-5 backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.35),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.22),transparent_30%)]" />
          <div className="relative grid h-full gap-3 sm:grid-cols-2">
            {workspace.boards.slice(0, 4).map((board) => (
              <div key={board.id} className="rounded-[22px] border border-white/8 bg-black/10 p-4">
                <div className="h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500" />
                <p className="mt-4 font-display text-lg text-white">{board.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

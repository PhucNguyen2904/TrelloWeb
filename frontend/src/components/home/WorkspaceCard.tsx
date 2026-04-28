"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Workspace } from "@/lib/mock-data";

interface WorkspaceCardProps {
  workspace: Workspace;
  index: number;
}

export function WorkspaceCard({ workspace, index }: WorkspaceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="rounded-[28px] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: workspace.color }} />
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{workspace.name}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{workspace.members.length} members</p>
          </div>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
          Active
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {workspace.boards.slice(0, 4).map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 transition-all duration-150 hover:bg-[var(--surface-2)]"
            aria-label={`Open board ${board.name}`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-8 w-1.5 rounded-full bg-[var(--accent)]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">{board.name}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Updated {board.lastUpdated}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.article>
  );
}

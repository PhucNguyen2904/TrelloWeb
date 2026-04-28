"use client";

import { Filter, MoreHorizontal } from "lucide-react";
import type { BoardSummary, Member } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";

interface BoardHeaderProps {
  board: BoardSummary;
  members: Member[];
}

export function BoardHeader({ board, members }: BoardHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(45,212,191,0.22),rgba(17,17,24,0.96)_45%,rgba(99,102,241,0.26))] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.12),transparent_24%)]" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--primary)]/65 to-transparent" />
      <div className="relative flex min-h-[80px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-white/65">Board View</p>
          <h1 className="font-display text-[28px] text-white">{board.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/72">{board.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex -space-x-2">
            {members.map((member) => (
              <span
                key={member.id}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-xs font-semibold text-white"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </span>
            ))}
          </div>
          <Button variant="secondary" className="rounded-full border-white/10 bg-white/10 text-white hover:bg-white/15">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/15"
            aria-label="Open board menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

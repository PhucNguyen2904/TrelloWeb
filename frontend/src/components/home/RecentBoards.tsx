"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Board } from "@/lib/types";

interface RecentBoardsProps {
  boards: Board[];
}

export function RecentBoards({ boards }: RecentBoardsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">
            Recently Viewed
          </p>
          <h2 className="font-display text-3xl text-[var(--text-primary)]">Pick up exactly where you left off.</h2>
        </div>
      </div>

      <div className="editorial-scroll -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
        {boards.map((board, index) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="shrink-0"
          >
            <Link
              href={`/boards`}
              aria-label={`Open board ${board.name}`}
              className="mesh-card group flex h-[140px] w-[220px] flex-col justify-between rounded-[24px] border border-border bg-gradient-to-br from-brand to-blue-700 p-4 shadow-card transition-all duration-150 hover:border-brand hover:shadow-lg"
            >
              <div className="flex justify-end">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/15 text-white/90 backdrop-blur">
                  <Star className="h-4 w-4" />
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex -space-x-2">
                  {board.members.slice(0, 4).map((member) => (
                    <span
                      key={member.id}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {member.initials}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="font-display text-[18px] text-white">{board.name}</h3>
                  <p className="mt-1 text-xs text-white/72">Recently viewed</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

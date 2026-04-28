"use client";

import type { ReactNode } from "react";
import { SurfaceCard } from "./SurfaceCard";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, actions, icon, className }: PageHeaderProps) {
  return (
    <SurfaceCard className={cn("p-4 sm:p-6", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          {icon ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-[var(--accent)] shadow-sm">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? (
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">{eyebrow}</p>
            ) : null}
            <h2 className="font-display text-2xl text-[var(--text-primary)] sm:text-3xl">{title}</h2>
            {subtitle ? <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">{subtitle}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </SurfaceCard>
  );
}

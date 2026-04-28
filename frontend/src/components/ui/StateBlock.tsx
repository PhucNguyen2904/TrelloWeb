"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StateBlockProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: "default" | "soft";
}

export function StateBlock({
  title,
  description,
  icon,
  action,
  className,
  tone = "default",
}: StateBlockProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center shadow-[var(--shadow-soft)]",
        tone === "soft"
          ? "border-[var(--border)] bg-[var(--surface-2)]"
          : "border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)]",
        className
      )}
    >
      {icon ? <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-secondary)] shadow-sm">{icon}</div> : null}
      <h3 className="font-display text-lg text-[var(--text-primary)]">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  muted?: boolean;
}

export function SurfaceCard({ className, muted = false, ...props }: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border shadow-[var(--shadow-soft)]",
        muted
          ? "border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_92%,transparent)]"
          : "border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)]",
        className
      )}
      {...props}
    />
  );
}

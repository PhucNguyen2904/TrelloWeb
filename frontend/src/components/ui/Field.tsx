"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  required?: boolean;
}

export function Field({
  className,
  label,
  helperText,
  error,
  required,
  children,
  ...props
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label ? (
        <div className="flex items-center gap-1">
          <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">{label}</label>
          {required ? <span className="text-xs text-[var(--accent-danger)]">*</span> : null}
        </div>
      ) : null}
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-xs text-[var(--accent-danger)]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-[var(--text-tertiary)]">{helperText}</p>
      ) : null}
    </div>
  );
}

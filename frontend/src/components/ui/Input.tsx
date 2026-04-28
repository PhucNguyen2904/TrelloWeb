"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseProps {
  hasError?: boolean;
}

const baseClassName =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-70 focus:border-[var(--border-hover)] focus:bg-[var(--surface-3)] focus:ring-4 focus:ring-[var(--ring)]";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {}
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {}
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        baseClassName,
        hasError && "border-[var(--accent-danger)] focus:border-[var(--accent-danger)] focus:ring-[rgba(239,68,68,0.18)]",
        className
      )}
      {...props}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, hasError, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        baseClassName,
        "min-h-[112px] resize-none py-3",
        hasError && "border-[var(--accent-danger)] focus:border-[var(--accent-danger)] focus:ring-[rgba(239,68,68,0.18)]",
        className
      )}
      {...props}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, hasError, children, ...props },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          baseClassName,
          "appearance-none pr-10 text-sm",
          hasError && "border-[var(--accent-danger)] focus:border-[var(--accent-danger)] focus:ring-[rgba(239,68,68,0.18)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
    </div>
  );
});

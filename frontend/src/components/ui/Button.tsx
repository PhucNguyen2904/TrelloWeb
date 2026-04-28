"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-[var(--accent)] text-white shadow-[0_8px_20px_rgba(99,102,241,0.28)] hover:brightness-110 active:translate-y-px focus-visible:ring-[var(--ring)]",
  secondary:
    "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-3)] focus-visible:ring-[var(--ring)]",
  ghost:
    "border border-transparent bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-2)] focus-visible:ring-[var(--ring)]",
  danger:
    "border border-transparent bg-[var(--accent-danger)] text-white shadow-[0_8px_20px_rgba(239,68,68,0.2)] hover:brightness-110 focus-visible:ring-[rgba(239,68,68,0.3)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    leadingIcon,
    trailingIcon,
    children,
    type = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leadingIcon}
      {children ? <span className="inline-flex items-center justify-center">{children}</span> : null}
      {!loading ? trailingIcon : null}
    </button>
  );
});

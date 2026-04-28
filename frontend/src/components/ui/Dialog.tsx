"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, description, children, footer, className }: DialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            aria-label="Close dialog overlay"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={cn(
                "w-full max-w-2xl overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]",
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-4 py-4 sm:px-6">
                <div className="min-w-0">
                  <h2 className="font-display text-xl text-[var(--text-primary)]">{title}</h2>
                  {description ? <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--text-secondary)] transition duration-200 ease-in-out hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] focus-visible:ring-4 focus-visible:ring-[var(--ring)]"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">{children}</div>
              {footer ? (
                <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] bg-[var(--surface-2)] px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                  {footer}
                </div>
              ) : null}
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

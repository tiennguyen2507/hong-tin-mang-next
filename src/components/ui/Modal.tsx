"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Nút hành động dưới cùng (ví dụ Lưu / Hủy) */
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 dark:bg-black/60"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-surface)] p-4 text-[var(--shop-text)] shadow-xl",
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--shop-text)]">
            {title}
          </h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-lg leading-none text-[var(--shop-muted)] transition hover:bg-[var(--shop-border)]/40"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
          >
            ×
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {footer ? (
          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-[var(--shop-border)] pt-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

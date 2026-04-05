"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 py-2 text-sm text-[var(--shop-text)] outline-none transition placeholder:text-[var(--shop-muted)] focus:border-[var(--shop-primary)] focus:ring-2 focus:ring-[var(--shop-primary)]/30",
        className,
      )}
      {...props}
    />
  );
}

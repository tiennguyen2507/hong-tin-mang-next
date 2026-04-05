"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 text-sm text-[var(--shop-text)] outline-none transition placeholder:text-[var(--shop-muted)] focus:border-[var(--shop-primary)] focus:ring-2 focus:ring-[var(--shop-primary)]/30",
        className,
      )}
      {...props}
    />
  );
}

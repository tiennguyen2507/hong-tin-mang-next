"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "muted" | "outline" | "soft";
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  muted: "bg-[var(--shop-border)]/30 text-[var(--shop-muted)]",
  outline:
    "border border-[var(--shop-border)] bg-[var(--shop-surface)] font-medium text-[var(--shop-text)] shadow-sm",
  soft: "bg-[var(--shop-primary)]/15 text-[var(--shop-primary)] ring-1 ring-[var(--shop-primary)]/25",
};

export function Badge({
  variant = "muted",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-1 text-xs",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

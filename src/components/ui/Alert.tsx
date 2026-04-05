"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "destructive" | "muted";
};

export function Alert({
  variant = "destructive",
  className,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border p-3 text-sm",
        variant === "destructive" &&
          "border-red-200 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-200",
        variant === "muted" &&
          "border-[var(--shop-border)] bg-[var(--shop-border)]/20 text-[var(--shop-text)]",
        className,
      )}
      {...props}
    />
  );
}

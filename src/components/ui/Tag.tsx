"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Tag({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--shop-border)] bg-[var(--shop-surface)] px-2.5 py-1 text-xs font-medium text-[var(--shop-text)]",
        className,
      )}
      {...props}
    />
  );
}

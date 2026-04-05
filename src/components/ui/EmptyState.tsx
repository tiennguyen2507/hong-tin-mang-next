"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement>;

export function EmptyState({ className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn("py-8 text-center text-sm text-[var(--shop-muted)]", className)}
      {...props}
    />
  );
}

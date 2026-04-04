"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type EmptyStateProps = React.HTMLAttributes<HTMLParagraphElement>;

export function EmptyState({ className, ...props }: EmptyStateProps) {
  return (
    <p
      className={cn("py-8 text-center text-sm text-slate-500", className)}
      {...props}
    />
  );
}

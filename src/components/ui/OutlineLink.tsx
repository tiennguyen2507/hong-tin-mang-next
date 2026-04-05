"use client";

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/cn";

export type OutlineLinkProps = React.ComponentProps<typeof Link> & {
  className?: string;
};

export function OutlineLink({ className, ...props }: OutlineLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 py-2 text-sm font-medium text-[var(--shop-text)] shadow-sm transition hover:bg-[var(--shop-border)]/30",
        className,
      )}
      {...props}
    />
  );
}

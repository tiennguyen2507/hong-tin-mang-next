"use client";

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/cn";

export type OutlineLinkProps = React.ComponentProps<typeof Link>;

export function OutlineLink({ className, ...props }: OutlineLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50",
        className,
      )}
      {...props}
    />
  );
}

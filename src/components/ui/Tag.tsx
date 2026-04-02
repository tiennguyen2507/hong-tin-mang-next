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
        "inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300",
        className,
      )}
      {...props}
    />
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700 dark:focus:ring-zinc-800/60",
        className,
      )}
      {...props}
    />
  );
}


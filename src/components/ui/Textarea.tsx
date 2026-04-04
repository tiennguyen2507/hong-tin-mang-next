"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-[#1a56db]/20 transition focus:border-[#1a56db] focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
      {...props}
    />
  );
}

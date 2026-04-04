"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "muted" | "outline" | "soft";
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  muted: "bg-slate-50 text-slate-500",
  outline:
    "border border-slate-200 bg-white font-medium text-slate-600 shadow-sm",
  soft: "bg-[#eff6ff] text-[#1d4ed8] ring-1 ring-[#bfdbfe]/80",
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

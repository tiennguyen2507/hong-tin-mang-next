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
          "border-red-200 bg-red-50 text-red-800",
        variant === "muted" &&
          "border-slate-200 bg-slate-50 text-slate-800",
        className,
      )}
      {...props}
    />
  );
}

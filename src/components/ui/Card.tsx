"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Mặc định có padding nội dung */
  padded?: boolean;
};

export function Card({ className, padded = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
        padded && "p-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm font-semibold text-slate-900", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

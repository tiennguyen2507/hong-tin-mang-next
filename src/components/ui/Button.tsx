"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-primary)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--shop-bg)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--shop-primary)] text-white hover:bg-[var(--shop-primary-hover)]",
  secondary:
    "border border-[var(--shop-border)] bg-[var(--shop-surface)] text-[var(--shop-text)] hover:bg-[var(--shop-border)]/35",
  danger: "bg-red-600 text-white hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500",
  ghost: "text-[var(--shop-text)] hover:bg-[var(--shop-border)]/35",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

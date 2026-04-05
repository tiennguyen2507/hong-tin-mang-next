"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type FieldProps = {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function Field({ id, label, children, className }: FieldProps) {
  return (
    <div className={cn("grid gap-1", className)}>
      <label htmlFor={id} className="text-xs font-medium text-[var(--shop-muted)]">
        {label}
      </label>
      {children}
    </div>
  );
}

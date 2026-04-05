"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type SectionHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <h2 className="text-sm font-semibold text-[var(--shop-text)]">{title}</h2>
      {description ? (
        <p className="mt-0.5 text-xs text-[var(--shop-muted)]">{description}</p>
      ) : null}
    </div>
  );
}

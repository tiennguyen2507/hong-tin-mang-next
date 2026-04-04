"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

const gapClass = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
} as const;

export type StackProps = {
  children: React.ReactNode;
  /** Khoảng cách dọc giữa các phần tử */
  gap?: keyof typeof gapClass;
  className?: string;
};

export function Stack({ children, gap = 4, className }: StackProps) {
  return (
    <div className={cn("flex flex-col", gapClass[gap], className)}>{children}</div>
  );
}

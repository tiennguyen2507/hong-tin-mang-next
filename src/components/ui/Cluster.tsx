"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

const gapClass = {
  2: "gap-2",
  3: "gap-3",
} as const;

export type ClusterProps = {
  children: React.ReactNode;
  gap?: keyof typeof gapClass;
  className?: string;
  /** Căn chỉnh theo trục chính (mặc định: flex-wrap + items-center) */
  align?: "start" | "center" | "end" | "stretch";
};

const alignClass: Record<NonNullable<ClusterProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export function Cluster({
  children,
  gap = 2,
  align = "center",
  className,
}: ClusterProps) {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap",
        gapClass[gap],
        alignClass[align],
        className,
      )}
    >
      {children}
    </div>
  );
}

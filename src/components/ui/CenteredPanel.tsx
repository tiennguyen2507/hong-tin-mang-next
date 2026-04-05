"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type CenteredPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Độ rộng tối đa vùng căn giữa */
  maxWidth?: "sm" | "md";
};

const maxW: Record<NonNullable<CenteredPanelProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
};

export function CenteredPanel({
  children,
  className,
  maxWidth = "md",
  ...props
}: CenteredPanelProps) {
  return (
    <div
      className={cn("mx-auto grid w-full max-w-full gap-4 px-1 sm:px-0", maxW[maxWidth], className)}
      {...props}
    >
      {children}
    </div>
  );
}

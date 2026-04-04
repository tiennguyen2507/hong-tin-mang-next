import * as React from "react";
import { cn } from "@/lib/cn";

export type StatGridProps = React.HTMLAttributes<HTMLDivElement>;

export function StatGrid({ className, ...props }: StatGridProps) {
  return (
    <div
      className={cn("grid gap-3 sm:grid-cols-3", className)}
      {...props}
    />
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type FormActionsProps = React.HTMLAttributes<HTMLDivElement>;

export function FormActions({ className, ...props }: FormActionsProps) {
  return (
    <div className={cn("mt-3 flex gap-2", className)} {...props} />
  );
}

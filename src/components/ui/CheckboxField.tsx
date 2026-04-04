"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type CheckboxFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
};

export function CheckboxField({
  id,
  label,
  className,
  ...props
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-800",
        className,
      )}
    >
      <span className="font-medium">{label}</span>
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 accent-[#2563eb]"
        {...props}
      />
    </label>
  );
}

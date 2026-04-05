"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type CheckboxFieldProps = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
};

export function CheckboxField({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center justify-between rounded-xl border border-[var(--shop-border)] bg-[var(--shop-border)]/15 px-3 py-2.5 text-sm text-[var(--shop-text)]",
        disabled && "opacity-50",
      )}
    >
      <span className="grid gap-0.5 pr-2">
        <span className="font-medium">{label}</span>
        {description ? (
          <span className="text-xs text-[var(--shop-muted)]">{description}</span>
        ) : null}
      </span>
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 shrink-0 rounded border-[var(--shop-border)] text-[var(--shop-primary)] focus:ring-[var(--shop-primary)]/40"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
    </label>
  );
}

import * as React from "react";
import { Card } from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  hintTone?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
};

export function StatCard({
  label,
  value,
  hint,
  hintTone = "neutral",
  icon,
}: StatCardProps) {
  const hintClass =
    hintTone === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : hintTone === "down"
        ? "text-rose-600 dark:text-rose-400"
        : "text-[var(--shop-muted)]";

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-[var(--shop-muted)]">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--shop-text)]">
            {value}
          </p>
          {hint ? (
            <p className={`mt-1 text-xs font-medium ${hintClass}`}>{hint}</p>
          ) : null}
        </div>
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--shop-border)]/25 text-[var(--shop-muted)]">
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

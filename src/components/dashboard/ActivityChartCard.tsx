"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const DEFAULT_BARS = [40, 65, 45, 80, 55, 90, 70];

export type ActivityChartCardProps = {
  title?: string;
  periodLabel?: string;
  /** Độ cao cột (0–100), mặc định mock 7 ngày */
  bars?: number[];
};

export function ActivityChartCard({
  title = "Hoạt động",
  periodLabel = "7 ngày qua",
  bars = DEFAULT_BARS,
}: ActivityChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Badge variant="muted">{periodLabel}</Badge>
      </CardHeader>
      <div className="mt-4 flex h-36 items-end justify-between gap-2 px-1">
        {bars.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full max-w-[32px] rounded-t-lg bg-linear-to-t from-[#2563eb] to-[#93c5fd]"
              style={{ height: `${h}%` }}
            />
            <span className="text-[10px] text-slate-400">{i + 1}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

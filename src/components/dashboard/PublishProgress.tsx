"use client";

import * as React from "react";

export type PublishProgressProps = {
  published: number;
  total: number;
};

export function PublishProgress({ published, total }: PublishProgressProps) {
  const pct = total ? Math.round((published / total) * 100) : 0;
  return (
    <span className="text-xs text-slate-500">
      Tiến độ:{" "}
      <span className="font-semibold text-[#1a56db]">{pct}%</span> đã đăng
    </span>
  );
}

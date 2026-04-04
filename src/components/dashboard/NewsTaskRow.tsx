"use client";

import Link from "next/link";
import type { NewsItem } from "@/lib/newsApi";
import { Button } from "@/components/ui/Button";

type NewsTaskRowProps = {
  item: NewsItem;
  busy: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

function statusMeta(status: boolean) {
  if (status) {
    return {
      label: "Đã đăng",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
    };
  }
  return {
    label: "Nháp",
    dot: "bg-amber-500",
    text: "text-amber-800",
  };
}

export function NewsTaskRow({
  item,
  busy,
  onEdit,
  onToggle,
  onDelete,
}: NewsTaskRowProps) {
  const meta = statusMeta(item.status);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-slate-900">
            {item.title}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
            {item.createdAt ? (
              <span className="text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleDateString("vi-VN")}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
        <Link
          href={`/news/${item._id}`}
          className="rounded-xl px-2 py-1.5 text-xs font-medium text-[#1a56db] hover:bg-[#e8f0fe]"
        >
          Xem
        </Link>
        <Button variant="secondary" size="sm" onClick={onEdit} disabled={busy}>
          Sửa
        </Button>
        <Button variant="ghost" size="sm" onClick={onToggle} disabled={busy}>
          Đổi TT
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete} disabled={busy}>
          Xóa
        </Button>
      </div>
    </div>
  );
}

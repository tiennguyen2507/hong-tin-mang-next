"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/cn";

export default function CartPage() {
  const { lines, setQty, remove, total, ready } = useCart();

  if (!ready) {
    return (
      <p className="text-sm text-[var(--shop-muted)]">Đang tải giỏ hàng...</p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-3xl border border-[var(--shop-border)] bg-[var(--shop-card)] px-6 py-12 shadow-sm">
          <p className="text-4xl" aria-hidden>
            🛒
          </p>
          <h1 className="mt-4 text-2xl font-bold text-[var(--shop-text)]">Giỏ hàng trống</h1>
          <p className="mt-2 text-sm text-[var(--shop-muted)]">Thêm món từ thực đơn để đặt hàng nhé.</p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[var(--shop-primary)] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[var(--shop-primary-hover)]"
          >
            Xem thực đơn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--shop-text)] sm:text-3xl">Giỏ hàng</h1>
        <p className="mt-1 text-sm text-[var(--shop-muted)]">{lines.length} món trong giỏ</p>
      </div>
      <ul className="grid gap-3">
        {lines.map((l) => (
          <li
            key={l.productId}
            className="flex flex-col gap-4 rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-card)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--shop-text)]">{l.name}</p>
              <p className="mt-1 text-sm text-[var(--shop-muted)]">
                <span className="font-medium text-[var(--shop-price)] tabular-nums">
                  {l.price.toLocaleString("vi-VN")} ₫
                </span>
                <span className="mx-1">×</span>
                {l.quantity}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-[var(--shop-muted)]">
                <span className="sr-only">Số lượng</span>
                <input
                  type="number"
                  min={1}
                  className={cn(
                    "h-10 w-20 rounded-xl border border-orange-200/80 bg-white px-2 text-center text-sm font-medium tabular-nums",
                    "text-[var(--shop-text)] outline-none focus:border-[var(--shop-primary)] focus:ring-2 focus:ring-orange-200/60",
                  )}
                  value={l.quantity}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isFinite(n)) setQty(l.productId, n);
                  }}
                />
              </label>
              <Button variant="ghost" size="sm" onClick={() => remove(l.productId)}>
                Xóa
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="sticky bottom-4 rounded-2xl border border-orange-200/60 bg-[var(--shop-surface)] p-4 shadow-[0_8px_30px_rgba(234,88,12,0.12)] sm:static sm:shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--shop-muted)]">Tạm tính</p>
            <p className="text-xl font-bold tabular-nums text-[var(--shop-price)]">
              {total.toLocaleString("vi-VN")} ₫
            </p>
          </div>
          <Link
            href="/checkout"
            className="inline-flex h-11 min-w-[180px] items-center justify-center rounded-full bg-[var(--shop-primary)] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--shop-primary-hover)]"
          >
            Tiến hành đặt hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

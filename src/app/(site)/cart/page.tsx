"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { lines, setQty, remove, total, ready } = useCart();

  if (!ready) {
    return <p className="text-sm text-zinc-600">Đang tải giỏ hàng...</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="grid gap-4">
        <h1 className="text-2xl font-semibold">Giỏ hàng</h1>
        <p className="text-sm text-zinc-600">Giỏ hàng đang trống.</p>
        <Link className="text-sm font-medium text-[#1a56db] hover:underline" href="/">
          ← Về thực đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Giỏ hàng</h1>
      <ul className="grid gap-3">
        {lines.map((l) => (
          <li
            key={l.productId}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div>
              <p className="font-semibold text-zinc-900">{l.name}</p>
              <p className="text-sm text-zinc-600">
                {l.price.toLocaleString("vi-VN")} đ × {l.quantity}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min={1}
                className="h-9 w-20 rounded-lg border border-zinc-200 px-2 text-sm dark:border-zinc-800"
                value={l.quantity}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) setQty(l.productId, n);
                }}
              />
              <Button variant="ghost" size="sm" onClick={() => remove(l.productId)}>
                Xóa
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold">
          Tạm tính:{" "}
          <span className="text-[#1a56db]">{total.toLocaleString("vi-VN")} đ</span>
        </p>
        <Link
          href="/checkout"
          className="inline-flex h-9 items-center justify-center rounded-full bg-[#2563eb] px-4 text-sm font-medium text-white hover:bg-[#1d4ed8]"
        >
          Đặt hàng
        </Link>
      </div>
    </div>
  );
}

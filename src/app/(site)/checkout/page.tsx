"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/cn";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, total, clear, ready } = useCart();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!lines.length) return;
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          deliveryAddress: address,
          note: note || undefined,
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            price: l.price,
            quantity: l.quantity,
          })),
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || `Lỗi ${res.status}`);
      clear();
      router.push("/?ordered=1");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Đặt hàng thất bại");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return <p className="text-sm text-[var(--shop-muted)]">Đang tải...</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold text-[var(--shop-text)]">Thanh toán</h1>
        <p className="mt-2 text-sm text-[var(--shop-muted)]">Giỏ hàng trống.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-[var(--shop-primary)] hover:underline"
        >
          Về thực đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-lg gap-8">
      <div className="rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-card)] p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-[var(--shop-text)]">Thanh toán</h1>
        <p className="mt-1 text-sm text-[var(--shop-muted)]">
          Thanh toán khi nhận hàng — điền thông tin giao hàng bên dưới.
        </p>
        <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-[var(--shop-border)] pt-4">
          <span className="text-sm font-medium text-[var(--shop-muted)]">Tổng đơn</span>
          <span className="text-xl font-bold tabular-nums text-[var(--shop-price)]">
            {total.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-card)] p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--shop-muted)]">
            Thông tin nhận hàng
          </h2>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[var(--shop-text)]">Họ và tên</span>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className={cn(
                  "rounded-xl border-orange-200/80 focus:border-[var(--shop-primary)] focus:ring-orange-200/50",
                )}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[var(--shop-text)]">Số điện thoại</span>
              <Input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="rounded-xl border-orange-200/80 focus:border-[var(--shop-primary)] focus:ring-orange-200/50"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[var(--shop-text)]">Địa chỉ giao hàng</span>
              <textarea
                required
                className="min-h-24 w-full rounded-xl border border-orange-200/80 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--shop-primary)] focus:ring-2 focus:ring-orange-200/50"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, đường, phường, quận..."
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-[var(--shop-text)]">Ghi chú (tuỳ chọn)</span>
              <textarea
                className="min-h-20 w-full rounded-xl border border-orange-200/80 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--shop-primary)] focus:ring-2 focus:ring-orange-200/50"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ít đường, giao trước 8h..."
              />
            </label>
          </div>
        </div>

        {err ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="submit"
            className="h-11 flex-1 bg-[var(--shop-primary)] font-semibold text-white hover:bg-[var(--shop-primary-hover)] sm:min-w-[200px]"
            disabled={busy}
          >
            {busy ? "Đang gửi đơn..." : "Xác nhận đặt hàng"}
          </Button>
          <Button variant="secondary" type="button" onClick={() => router.push("/cart")}>
            Quay lại giỏ hàng
          </Button>
        </div>
      </form>
    </div>
  );
}

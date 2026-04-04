"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/contexts/CartContext";

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
    return <p className="text-sm text-zinc-600">Đang tải...</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="grid gap-3">
        <h1 className="text-2xl font-semibold">Thanh toán</h1>
        <p className="text-sm text-zinc-600">Giỏ hàng trống.</p>
        <Link className="text-sm font-medium text-[#1a56db]" href="/">
          Về thực đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-lg gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Thanh toán</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Tổng:{" "}
          <span className="font-semibold text-[#1a56db]">
            {total.toLocaleString("vi-VN")} đ
          </span>
        </p>
      </div>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-zinc-700">Họ tên</span>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-zinc-700">Số điện thoại</span>
          <Input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxx"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-zinc-700">Địa chỉ giao hàng</span>
          <textarea
            required
            className="min-h-24 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, đường, phường..."
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-zinc-700">Ghi chú (tuỳ chọn)</span>
          <textarea
            className="min-h-20 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ít đường, lấy trước 8h..."
          />
        </label>
        {err ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {err}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            className="bg-[#2563eb] hover:bg-[#1d4ed8]"
            disabled={busy}
          >
            {busy ? "Đang gửi..." : "Xác nhận đặt hàng"}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.push("/cart")}
          >
            Quay lại giỏ
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/contexts/CartContext";
import type { ProductCategory } from "@/lib/models";
import { getProductImageUrl } from "@/lib/productImages";
import { ProductImageWithFallback } from "@/components/shop/ProductImageWithFallback";
import { cn } from "@/lib/cn";

/** Nền trắng + chữ tối cố định (mockup kem). Cần `border` (độ dày) kèm màu — chỉ `border-[color]` không đủ cho textarea. */
const cartFieldClass =
  "rounded-xl border border-[#d7cfc4] bg-white text-stone-900 placeholder:text-stone-500 shadow-none dark:border-[#d7cfc4] dark:bg-white dark:text-stone-900 dark:placeholder:text-stone-500";

export default function CartPage() {
  const router = useRouter();
  const { lines, setQty, remove, total, count, clear, ready } = useCart();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [note, setNote] = React.useState("");
  const [distanceOk, setDistanceOk] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!lines.length) return;
    if (!distanceOk) {
      setErr("Vui lòng xác nhận khoảng cách giao hàng.");
      return;
    }
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
      router.push("/order?ordered=1");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Đặt hàng thất bại");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="min-h-[40vh] bg-[var(--cart-page-bg)] px-4 py-8">
        <p className="text-sm text-[var(--order-muted)]">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[var(--cart-page-bg)] pb-12 pt-6 text-[var(--cart-text)] [color-scheme:light] sm:pb-16 sm:pt-8"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-order-serif text-2xl font-bold text-[var(--cart-text)] sm:text-3xl">Giỏ hàng</h1>
            {count > 0 ? (
              <p className="mt-1 text-sm text-[var(--order-muted)]">{count} món trong giỏ</p>
            ) : null}
          </div>
          <Link
            href="/order"
            className="inline-flex w-fit items-center rounded-xl border border-[#d7cfc4] bg-white px-4 py-2.5 text-sm font-medium text-[var(--cart-text)] shadow-sm transition hover:bg-stone-50 dark:border-[#d7cfc4] dark:bg-white dark:text-[var(--cart-text)] dark:hover:bg-stone-50"
          >
            ← Trở về đặt món
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-[#e8e0d8] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#ebe3dc] bg-[var(--cart-table-head)]">
                  <th className="px-4 py-3 font-semibold text-[var(--cart-text)]">Sản phẩm</th>
                  <th className="px-4 py-3 font-semibold text-[var(--cart-text)]">Giá</th>
                  <th className="px-4 py-3 font-semibold text-[var(--cart-text)]">Số lượng</th>
                  <th className="px-4 py-3 text-right font-semibold text-[var(--cart-text)]">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {lines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-sm font-medium text-[var(--cart-text)]">
                      Giỏ hàng trống.
                    </td>
                  </tr>
                ) : null}
                {lines.map((l) => {
                  const cat: ProductCategory = l.category ?? "breakfast";
                  const imgSrc = getProductImageUrl({
                    imageUrl: l.imageUrl,
                    category: cat,
                  });
                  const lineTotal = l.price * l.quantity;
                  return (
                    <tr key={l.productId} className="border-b border-[#f0ebe6] last:border-0">
                      <td className="px-4 py-3 align-middle">
                        <div className="flex gap-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                            <ProductImageWithFallback
                              src={imgSrc}
                              alt={l.name}
                              category={cat}
                              sizes="56px"
                              variant="thumb"
                            />
                          </div>
                          <div className="min-w-0 py-0.5">
                            <p className="font-bold text-[var(--cart-text)]">{l.name}</p>
                            <button
                              type="button"
                              onClick={() => remove(l.productId)}
                              className="mt-1 text-xs font-medium text-red-700/90 underline-offset-2 hover:underline"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle font-semibold tabular-nums text-[var(--cart-text)]">
                        {l.price.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Giảm"
                            disabled={l.quantity <= 1}
                            onClick={() => setQty(l.productId, l.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d4c4b0] bg-white text-stone-600 transition hover:bg-stone-50 disabled:opacity-40"
                          >
                            −
                          </button>
                          <input
                            readOnly
                            value={l.quantity}
                            className="h-8 w-10 rounded-md border border-[#d4c4b0] bg-white text-center text-sm font-semibold tabular-nums text-stone-900 dark:bg-white dark:text-stone-900"
                            aria-label="Số lượng"
                          />
                          <button
                            type="button"
                            aria-label="Tăng"
                            onClick={() => setQty(l.productId, l.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d4c4b0] bg-white text-stone-600 transition hover:bg-stone-50"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right align-middle font-bold tabular-nums text-[var(--cart-text)]">
                        {lineTotal.toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-[#e8e0d8] bg-white p-5 shadow-sm sm:p-6 dark:bg-white">
              <h2 className="text-lg font-bold text-[var(--cart-text)]">Thông tin khách hàng</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-[var(--cart-text)]">Họ và tên</span>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={cn(
                    cartFieldClass,
                    "focus:border-[var(--shop-primary)] focus:ring-2 focus:ring-orange-200/50",
                  )}
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-[var(--cart-text)]">Số điện thoại</span>
                <Input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xx xxx xxx"
                  className={cn(
                    cartFieldClass,
                    "focus:border-[var(--shop-primary)] focus:ring-2 focus:ring-orange-200/50",
                  )}
                />
              </label>
              </div>
            <label className="mt-4 grid gap-1.5 text-sm">
              <span className="font-medium text-[var(--cart-text)]">Địa chỉ giao hàng</span>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, đường, phường, quận..."
                className={cn(
                  cartFieldClass,
                  "min-h-[5.5rem] w-full px-3 py-2.5 text-sm outline-none transition focus:border-[var(--shop-primary)] focus:ring-2 focus:ring-orange-200/50",
                )}
              />
            </label>
            <label className="mt-4 grid gap-1.5 text-sm">
              <span className="font-medium text-[var(--cart-text)]">Ghi chú</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ít đường, giao trước 8h..."
                className={cn(
                  cartFieldClass,
                  "min-h-[4.5rem] w-full px-3 py-2.5 text-sm outline-none transition focus:border-[var(--shop-primary)] focus:ring-2 focus:ring-orange-200/50",
                )}
              />
            </label>

            <p className="mt-4 text-xs leading-relaxed text-red-700 dark:text-red-600">
              * Giao hàng trong bán kính 12km tính từ khu FPT Complex, Nam Kỳ Khởi Nghĩa, Đà Nẵng. Vui lòng kiểm
              tra khoảng cách trước khi đặt.
            </p>

            <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-[var(--cart-text)]">
              <input
                type="checkbox"
                checked={distanceOk}
                onChange={(e) => setDistanceOk(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-[#d7cfc4] text-[var(--shop-primary)] focus:ring-orange-200"
              />
              <span>Bạn đã kiểm tra khoảng cách từ bạn đến chúng tôi dưới 12km phải không?</span>
            </label>

            {err ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{err}</p>
            ) : null}

            <button
              type="submit"
              disabled={busy || lines.length === 0}
              className={cn(
                "mt-4 w-full rounded-xl px-4 py-3.5 text-base font-semibold text-white shadow-sm transition",
                "bg-[var(--cart-btn)] hover:bg-[var(--cart-btn-hover)] disabled:opacity-60",
              )}
            >
              {busy ? "Đang gửi đơn..." : "Xác nhận đặt"}
            </button>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-[#e8e0d8] bg-white p-5 shadow-sm dark:bg-white">
              <h3 className="text-lg font-bold text-[var(--cart-text)]">Tổng kết</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 text-[var(--order-muted)]">
                  <dt>Tổng sản phẩm</dt>
                  <dd className="font-semibold tabular-nums text-[var(--cart-text)]">{count}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-[#f0ebe6] pt-3">
                  <dt className="font-semibold text-[var(--cart-text)]">Tổng cộng</dt>
                  <dd className="text-lg font-bold tabular-nums text-[var(--cart-text)]">
                    {total.toLocaleString("vi-VN")} đ
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

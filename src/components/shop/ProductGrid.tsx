"use client";

import * as React from "react";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductCategory } from "@/lib/models";
import { CATEGORY_LABELS } from "@/lib/models";
import { getProductImageUrl } from "@/lib/productImages";
import { ProductImageWithFallback } from "@/components/shop/ProductImageWithFallback";
import { cn } from "@/lib/cn";

const ORDER: ProductCategory[] = ["breakfast", "cafe", "drink"];

const CATEGORY_SUBTITLE: Record<ProductCategory, string> = {
  breakfast: "Bánh mì, phở, xôi và các món sáng đầy đủ dinh dưỡng mỗi ngày.",
  cafe: "Espresso, phin, latte — pha tại quầy, nóng hoặc đá.",
  drink: "Cafe, sinh tố, trà sữa và các loại thức uống tươi ngon, bổ dưỡng.",
};

const catAccent: Record<ProductCategory, string> = {
  breakfast:
    "from-amber-100 to-orange-50 dark:from-[var(--landing-peach)] dark:to-[var(--landing-cream)]",
  cafe: "from-stone-200 to-amber-100/80 dark:from-stone-700 dark:to-stone-900",
  drink: "from-sky-100 to-cyan-50 dark:from-sky-950 dark:to-cyan-950",
};

function OrderProductCard({
  p,
  cat,
}: {
  p: Product;
  cat: ProductCategory;
}) {
  const { add } = useCart();
  const [qty, setQty] = React.useState(0);
  const src = getProductImageUrl(p);
  const max = Math.max(0, p.stock);

  function inc() {
    setQty((q) => Math.min(max, q + 1));
  }
  function dec() {
    setQty((q) => Math.max(0, q - 1));
  }

  function onAdd() {
    if (qty <= 0 || p.stock <= 0) return;
    add({
      productId: p._id,
      name: p.name,
      price: p.price,
      quantity: qty,
      imageUrl: src,
      category: cat,
    });
    setQty(0);
  }

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-[var(--shop-border)] bg-[var(--order-card)] p-2 shadow-sm sm:p-2.5",
        "transition-shadow hover:shadow-md",
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-md bg-linear-to-br",
          catAccent[cat],
        )}
      >
        <ProductImageWithFallback
          src={src}
          alt={p.name}
          category={cat}
          sizes="(max-width: 1024px) 50vw, 25vw"
          imgClassName="object-cover"
        />
        {p.stock > 0 && p.stock <= 5 ? (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-[var(--shop-price)] px-1.5 py-px text-[9px] font-bold text-white shadow-sm">
            Sắp hết
          </span>
        ) : null}
      </div>

      <div className="mt-1.5 flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-[0.8125rem] font-bold leading-[1.2] text-[var(--order-text)] sm:text-sm">
          {p.name}
        </h3>
        {p.description ? (
          <p className="mt-0.5 line-clamp-1 text-[0.65rem] leading-tight text-[var(--order-muted)] sm:text-[0.7rem]">
            {p.description}
          </p>
        ) : null}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[0.6rem] font-medium text-[var(--order-muted)] sm:text-[0.65rem]">SL:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Giảm"
              disabled={p.stock <= 0 || qty <= 0}
              onClick={dec}
              className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-[var(--shop-border)] bg-[var(--shop-surface)] text-sm font-medium text-[var(--order-text)] transition enabled:hover:opacity-90 enabled:active:opacity-90 disabled:opacity-40 sm:h-7 sm:w-7 sm:rounded"
            >
              −
            </button>
            <input
              type="text"
              inputMode="numeric"
              readOnly
              value={qty}
              className="h-8 w-10 rounded-lg border border-[var(--shop-border)] bg-[var(--shop-surface)] text-center text-[0.7rem] font-semibold tabular-nums text-[var(--order-text)] sm:h-7 sm:w-10 sm:rounded sm:text-xs"
              aria-label="Số lượng"
            />
            <button
              type="button"
              aria-label="Tăng"
              disabled={p.stock <= 0 || qty >= max}
              onClick={inc}
              className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-[var(--shop-border)] bg-[var(--shop-surface)] text-sm font-medium text-[var(--order-text)] transition enabled:hover:opacity-90 enabled:active:opacity-90 disabled:opacity-40 sm:h-7 sm:w-7 sm:rounded"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-[var(--shop-border)] pt-1.5">
          <p className="text-[0.7rem] font-bold tabular-nums leading-tight text-[var(--order-text)] sm:text-xs">
            {p.price.toLocaleString("vi-VN")} đ{" "}
            <span className="text-[0.6rem] font-semibold text-[var(--order-muted)]">/phần</span>
          </p>
          <button
            type="button"
            disabled={p.stock <= 0 || qty <= 0}
            onClick={onAdd}
            className="min-h-8 shrink-0 touch-manipulation rounded-lg bg-[var(--order-btn)] px-2.5 py-1 text-[0.65rem] font-semibold text-white shadow-sm transition hover:bg-[var(--order-btn-hover)] active:opacity-95 disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
          >
            {p.stock <= 0 ? "Hết hàng" : "Thêm"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  const grouped = React.useMemo(() => {
    const m = new Map<ProductCategory, Product[]>();
    for (const c of ORDER) m.set(c, []);
    for (const p of products) {
      const arr = m.get(p.category) ?? [];
      arr.push(p);
      m.set(p.category, arr);
    }
    return m;
  }, [products]);

  return (
    <div className="grid gap-8 md:gap-10">
      {ORDER.map((cat) => {
        const list = grouped.get(cat) ?? [];
        if (list.length === 0) return null;
        return (
          <section key={cat} className="grid gap-4 md:gap-5">
            <header className="max-w-3xl">
              <h2 className="font-order-serif text-2xl font-bold tracking-tight text-[var(--order-text)] md:text-[1.75rem]">
                {CATEGORY_LABELS[cat]}
              </h2>
              <p className="mt-1.5 text-xs leading-snug text-[var(--order-muted)] md:text-sm">
                {CATEGORY_SUBTITLE[cat]}
              </p>
            </header>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:gap-4">
              {list.map((p) => (
                <OrderProductCard key={p._id} p={p} cat={cat} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

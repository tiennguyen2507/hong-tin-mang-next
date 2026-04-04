"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductCategory } from "@/lib/models";
import { CATEGORY_LABELS } from "@/lib/models";
import { getProductImageUrl } from "@/lib/productImages";
import { ProductImageWithFallback } from "@/components/shop/ProductImageWithFallback";
import { cn } from "@/lib/cn";

const ORDER: ProductCategory[] = ["breakfast", "cafe", "drink"];

const catAccent: Record<ProductCategory, string> = {
  breakfast: "from-amber-100 to-orange-50",
  cafe: "from-stone-200 to-amber-100/80",
  drink: "from-sky-100 to-cyan-50",
};

export function ProductGrid({ products }: { products: Product[] }) {
  const { add } = useCart();

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
    <div className="grid gap-12">
      {ORDER.map((cat) => {
        const list = grouped.get(cat) ?? [];
        if (list.length === 0) return null;
        return (
          <section key={cat} className="grid gap-5">
            <div className="flex items-end justify-between gap-3 border-b border-[var(--shop-border)] pb-3">
              <div>
                <h2 className="text-xl font-bold text-[var(--shop-text)] sm:text-2xl">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--shop-muted)]">Chọn món — thêm vào giỏ</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => {
                const src = getProductImageUrl(p);
                return (
                <article
                  key={p._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-card)] shadow-[0_2px_12px_rgba(41,37,36,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(234,88,12,0.12)]"
                >
                  <div
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden bg-gradient-to-br",
                      catAccent[cat],
                    )}
                  >
                    <ProductImageWithFallback
                      src={src}
                      alt={p.name}
                      category={cat}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      imgClassName="transition duration-300 group-hover:scale-[1.03]"
                    />
                    {p.stock > 0 && p.stock <= 5 ? (
                      <span className="absolute left-2 top-2 rounded-full bg-[var(--shop-price)] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                        Sắp hết
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-semibold leading-snug text-[var(--shop-text)]">
                      {p.name}
                    </h3>
                    {p.description ? (
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--shop-muted)]">
                        {p.description}
                      </p>
                    ) : null}
                    <div className="mt-3 flex items-baseline justify-between gap-2">
                      <p className="text-lg font-bold tabular-nums text-[var(--shop-price)]">
                        {p.price.toLocaleString("vi-VN")}
                        <span className="ml-0.5 text-sm font-semibold">₫</span>
                      </p>
                      {p.stock <= 0 ? (
                        <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                          Hết hàng
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--shop-muted)]">Còn {p.stock}</span>
                      )}
                    </div>
                    <Button
                      className="mt-4 w-full bg-[var(--shop-primary)] font-semibold text-white shadow-sm hover:bg-[var(--shop-primary-hover)]"
                      size="sm"
                      disabled={p.stock <= 0}
                      onClick={() =>
                        add({
                          productId: p._id,
                          name: p.name,
                          price: p.price,
                          quantity: 1,
                        })
                      }
                    >
                      {p.stock <= 0 ? "Tạm hết" : "Thêm vào giỏ"}
                    </Button>
                  </div>
                </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

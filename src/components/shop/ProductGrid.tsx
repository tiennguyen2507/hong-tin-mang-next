"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductCategory } from "@/lib/models";
import { CATEGORY_LABELS } from "@/lib/models";

const ORDER: ProductCategory[] = ["breakfast", "cafe", "drink"];

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
    <div className="grid gap-10">
      {ORDER.map((cat) => {
        const list = grouped.get(cat) ?? [];
        if (list.length === 0) return null;
        return (
          <section key={cat} className="grid gap-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((p) => (
                <article
                  key={p._id}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="font-semibold text-zinc-900">{p.name}</h3>
                    {p.description ? (
                      <p className="text-sm text-zinc-600 line-clamp-2">{p.description}</p>
                    ) : null}
                    <p className="mt-2 text-base font-semibold text-[#1a56db]">
                      {p.price.toLocaleString("vi-VN")} đ
                    </p>
                    {p.stock <= 0 ? (
                      <p className="text-xs font-medium text-rose-600">Hết hàng</p>
                    ) : (
                      <p className="text-xs text-zinc-500">Còn {p.stock}</p>
                    )}
                  </div>
                  <Button
                    className="mt-4 w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
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
                    Thêm vào giỏ
                  </Button>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}


import type { Metadata } from "next";
import { listProducts } from "@/lib/db/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopHero } from "@/components/shop/ShopHero";

export const metadata: Metadata = {
  title: "Đặt hàng — Đồ ăn sáng & Cafe",
  description: "Thực đơn đồ ăn sáng, cafe và đồ uống. Thêm vào giỏ và giao tận nơi.",
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ ordered?: string }>;
}) {
  const { ordered } = await searchParams;
  let dbError: string | null = null;
  let products: Awaited<ReturnType<typeof listProducts>> = [];
  try {
    products = await listProducts({ activeOnly: true });
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Lỗi";
  }

  if (dbError) {
    return (
      <div className="bg-[var(--order-bg)]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50 p-5 text-sm text-amber-950 shadow-sm dark:border-amber-800/55 dark:bg-amber-950/45 dark:text-amber-100">
            <p className="font-semibold">Chưa kết nối cơ sở dữ liệu</p>
            <p className="mt-1 opacity-90 dark:opacity-95">{dbError}</p>
            <p className="mt-3 text-xs leading-relaxed text-amber-900/80 dark:text-amber-200/90">
              Thêm biến{" "}
              <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono dark:bg-black/35 dark:text-amber-100">
                MONGODB_URI
              </code>{" "}
              vào{" "}
              <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono dark:bg-black/35 dark:text-amber-100">
                .env.local
              </code>{" "}
              rồi khởi động lại dev server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--order-bg)]">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-7">
        {ordered === "1" ? (
          <div
            className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3.5 text-sm text-emerald-950 shadow-sm dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-100 sm:items-center"
            role="status"
          >
            <span className="text-lg" aria-hidden>
              ✓
            </span>
            <div>
              <p className="font-semibold">Đặt hàng thành công!</p>
              <p className="mt-0.5 text-emerald-900/85 dark:text-emerald-200/90">
                Cảm ơn bạn — chúng tôi sẽ liên hệ xác nhận sớm.
              </p>
            </div>
          </div>
        ) : null}

        <ShopHero />

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--shop-border)] bg-[var(--order-card)] px-4 py-10 text-center sm:p-12">
            <p className="font-medium text-[var(--order-muted)]">Chưa có món nào trong thực đơn.</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--order-muted)]">
              Vào trang quản trị để thêm sản phẩm.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}

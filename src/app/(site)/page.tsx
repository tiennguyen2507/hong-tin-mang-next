import { listProducts } from "@/lib/db/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopHero } from "@/components/shop/ShopHero";

export default async function HomePage({
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
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50 p-5 text-sm text-amber-950 shadow-sm">
        <p className="font-semibold">Chưa kết nối cơ sở dữ liệu</p>
        <p className="mt-1 opacity-90">{dbError}</p>
        <p className="mt-3 text-xs leading-relaxed text-amber-900/80">
          Thêm biến <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono">MONGODB_URI</code> vào{" "}
          <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono">.env.local</code> rồi khởi động lại dev
          server.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:gap-10">
      {ordered === "1" ? (
        <div
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950 shadow-sm sm:items-center"
          role="status"
        >
          <span className="text-lg" aria-hidden>
            ✓
          </span>
          <div>
            <p className="font-semibold">Đặt hàng thành công!</p>
            <p className="mt-0.5 text-emerald-900/85">Cảm ơn bạn — chúng tôi sẽ liên hệ xác nhận sớm.</p>
          </div>
        </div>
      ) : null}

      <ShopHero />

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--shop-border)] bg-[var(--shop-card)] p-8 text-center">
          <p className="font-medium text-[var(--shop-muted)]">Chưa có món nào trong thực đơn.</p>
          <p className="mt-1 text-sm text-[var(--shop-muted)]">Vào trang quản trị để thêm sản phẩm.</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

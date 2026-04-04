import { listProducts } from "@/lib/db/products";
import { ProductGrid } from "@/components/shop/ProductGrid";

export default async function HomePage() {
  let dbError: string | null = null;
  let products: Awaited<ReturnType<typeof listProducts>> = [];
  try {
    products = await listProducts({ activeOnly: true });
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Lỗi";
  }

  if (dbError) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-semibold">Chưa kết nối cơ sở dữ liệu</p>
        <p className="mt-1 opacity-90">{dbError}</p>
        <p className="mt-2 text-xs">
          Thêm biến <code className="rounded bg-white/60 px-1">MONGODB_URI</code> vào{" "}
          <code className="rounded bg-white/60 px-1">.env.local</code> rồi khởi động lại dev server.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Đặt đồ ăn sáng, cafe &amp; nước uống
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Giao tận nơi — đặt online nhanh chóng.
        </p>
      </div>
      {products.length === 0 ? (
        <p className="text-sm text-zinc-600">Chưa có món nào. Vào trang quản trị để thêm sản phẩm.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

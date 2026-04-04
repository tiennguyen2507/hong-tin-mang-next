import type { ProductCategory } from "@/lib/models";

/** Ảnh mặc định theo danh mục khi sản phẩm chưa có `imageUrl` (Unsplash, dùng được trong demo). */
const FALLBACK_BY_CATEGORY: Record<ProductCategory, string> = {
  breakfast:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  cafe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  drink:
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
};

export function getProductImageUrl(product: {
  imageUrl?: string;
  category: ProductCategory;
}): string {
  const u = product.imageUrl?.trim();
  if (u) return u;
  return FALLBACK_BY_CATEGORY[product.category];
}

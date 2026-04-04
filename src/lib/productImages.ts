import type { ProductCategory } from "@/lib/models";

/** Ảnh mặc định theo danh mục — màu tươi, phong cách gần mood board (khi chưa có imageUrl). */
const FALLBACK_BY_CATEGORY: Record<ProductCategory, string> = {
  breakfast:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  cafe: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
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

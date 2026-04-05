import { CartProvider } from "@/contexts/CartContext";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { SiteHeader } from "@/components/shop/SiteHeader";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {/* main min-h-dvh: màn đầu chỉ header + nội dung; footer nằm dưới fold, kéo xuống mới thấy */}
      <div className="flex w-full flex-col bg-[var(--shop-bg)] text-[var(--shop-text)] antialiased transition-colors duration-300">
        <SiteHeader />
        <main className="flex w-full min-h-dvh flex-col">{children}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}

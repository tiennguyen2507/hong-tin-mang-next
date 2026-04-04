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
      <div className="flex min-h-dvh flex-col bg-white text-[var(--shop-text)] antialiased">
        <SiteHeader />
        <main className="flex w-full flex-1 flex-col">{children}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}

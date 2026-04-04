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
      <div className="flex min-h-dvh flex-col bg-[var(--shop-bg)] text-[var(--shop-text)] antialiased">
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-5 sm:py-10">{children}</div>
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}

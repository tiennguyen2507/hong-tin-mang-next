import { CartProvider } from "@/contexts/CartContext";
import { SiteHeader } from "@/components/shop/SiteHeader";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl flex-1 px-3 py-5 sm:px-4 sm:py-8">
          {children}
        </div>
      </main>
    </CartProvider>
  );
}

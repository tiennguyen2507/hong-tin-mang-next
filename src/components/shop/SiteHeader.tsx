"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/60 bg-zinc-50/80 backdrop-blur dark:border-zinc-800/60 dark:bg-black/60">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Đồ ăn sáng & Cafe"
            width={140}
            height={44}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link className="text-zinc-700 hover:text-zinc-900" href="/">
            Thực đơn
          </Link>
          <Link
            className="relative rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
            href="/cart"
          >
            Giỏ hàng
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563eb] px-1 text-[11px] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--shop-border)] bg-[var(--shop-surface)]/95 shadow-[0_4px_20px_rgba(41,37,36,0.06)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
          <Image
            src="/logo.png"
            alt="Đồ ăn sáng & Cafe"
            width={140}
            height={44}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--shop-text)] transition hover:bg-orange-50 hover:text-[var(--shop-primary)]"
          >
            Thực đơn
          </Link>
          <Link
            href="/cart"
            className={cn(
              "relative inline-flex items-center gap-1.5 rounded-full border border-orange-200/90 bg-white px-3.5 py-2 text-sm font-semibold text-[var(--shop-text)] shadow-sm transition hover:border-orange-300 hover:bg-orange-50/80",
            )}
          >
            <svg
              className="h-4 w-4 text-[var(--shop-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="hidden sm:inline">Giỏ hàng</span>
            <span className="sm:hidden">Giỏ</span>
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--shop-primary)] px-1 text-[11px] font-bold text-white shadow-sm">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}

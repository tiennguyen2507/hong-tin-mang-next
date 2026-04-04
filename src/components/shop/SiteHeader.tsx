"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/", label: "Trang chủ" },
  { href: "/#about", label: "Giới thiệu" },
  { href: "/#features", label: "Tính năng" },
  { href: "/#privacy", label: "Chính sách" },
];

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-orange-100/80 bg-white/90 shadow-sm shadow-orange-100/30 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 transition hover:opacity-90">
          <Image
            src="/logo.png"
            alt="Đồ ăn sáng & Cafe"
            width={140}
            height={44}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-orange-50 hover:text-[var(--landing-orange)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/order"
            className="hidden rounded-full bg-[var(--landing-orange)] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#e07d28] sm:inline-flex"
          >
            Đặt món
          </Link>
          <Link
            href="/cart"
            className={cn(
              "relative inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-orange-300 hover:bg-orange-50/80",
            )}
          >
            <svg
              className="h-4 w-4 text-[var(--landing-orange)]"
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
            <span className="hidden sm:inline">Giỏ</span>
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--landing-orange)] px-1 text-[11px] font-bold text-white shadow-sm">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}

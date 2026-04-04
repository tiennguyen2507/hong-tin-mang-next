"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[var(--landing-section-cream)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <p className="font-heading text-lg font-bold text-stone-900">Đồ ăn sáng &amp; Cafe</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Đặt món online — giao tận nơi, thanh toán khi nhận. Thực đơn đổi mỗi ngày.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-600 shadow-sm transition hover:text-[var(--landing-orange)]"
                aria-label="Facebook"
              >
                <span aria-hidden>f</span>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-600 shadow-sm transition hover:text-[var(--landing-orange)]"
                aria-label="Zalo"
              >
                <span aria-hidden>Z</span>
              </a>
            </div>
            <form className="mt-5 flex max-w-xs flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter" className="sr-only">
                Email nhận tin
              </label>
              <input
                id="newsletter"
                type="email"
                placeholder="Email nhận khuyến mãi"
                className="min-h-10 flex-1 rounded-full border border-orange-200/80 bg-white px-4 text-sm outline-none ring-0 placeholder:text-stone-400 focus:border-[var(--landing-orange)]"
              />
              <button
                type="submit"
                className="rounded-full bg-[var(--landing-orange)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e07d28]"
              >
                Đăng ký
              </button>
            </form>
          </div>
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-stone-900">Liên hệ</p>
            <ul className="mt-4 space-y-2 text-sm text-stone-600">
              <li>123 Đường ABC, Quận 1, TP.HCM</li>
              <li>
                <a href="tel:0281234567" className="hover:text-[var(--landing-orange)]">
                  028 1234 567
                </a>
              </li>
              <li>
                <a href="mailto:hello@example.com" className="hover:text-[var(--landing-orange)]">
                  hello@example.com
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-stone-900">Bắt đầu</p>
            <Link
              href="/order"
              className="mt-4 inline-flex rounded-full bg-[var(--landing-orange)] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#e07d28]"
            >
              Đặt món ngay
            </Link>
          </div>
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-stone-900">Tải ứng dụng</p>
            <p className="mt-3 text-sm text-stone-600">Sắp ra mắt trên App Store &amp; Google Play.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-500">
                App Store
              </span>
              <span className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-500">
                Google Play
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--landing-orange)] py-3 text-center text-xs font-medium text-white">
        © {new Date().getFullYear()} Đồ ăn sáng &amp; Cafe. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}

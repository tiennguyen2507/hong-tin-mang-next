"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--shop-border)] bg-[var(--landing-section-cream)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <p className="font-heading text-lg font-bold text-[var(--shop-text)]">Đồ ăn sáng &amp; Cafe</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--shop-muted)]">
              Đặt món online — giao tận nơi, thanh toán khi nhận. Thực đơn đổi mỗi ngày.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shop-surface)] text-[var(--shop-muted)] shadow-sm transition hover:text-[var(--shop-primary)]"
                aria-label="Facebook"
              >
                <span aria-hidden>f</span>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shop-surface)] text-[var(--shop-muted)] shadow-sm transition hover:text-[var(--shop-primary)]"
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
                className="min-h-10 flex-1 rounded-full border border-[var(--shop-border)] bg-[var(--shop-surface)] px-4 text-sm text-[var(--shop-text)] outline-none ring-0 placeholder:text-[var(--shop-muted)] focus:border-[var(--shop-primary)]"
              />
              <button
                type="submit"
                className="rounded-full bg-[var(--shop-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--shop-primary-hover)]"
              >
                Đăng ký
              </button>
            </form>
          </div>
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--shop-text)]">Liên hệ</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--shop-muted)]">
              <li>123 Đường ABC, Quận 1, TP.HCM</li>
              <li>
                <a href="tel:0281234567" className="hover:text-[var(--shop-primary)]">
                  028 1234 567
                </a>
              </li>
              <li>
                <a href="mailto:hello@example.com" className="hover:text-[var(--shop-primary)]">
                  hello@example.com
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--shop-text)]">Bắt đầu</p>
            <Link
              href="/order"
              className="mt-4 inline-flex rounded-full bg-[var(--shop-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--shop-primary-hover)]"
            >
              Đặt món ngay
            </Link>
          </div>
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--shop-text)]">Tải ứng dụng</p>
            <p className="mt-3 text-sm text-[var(--shop-muted)]">Sắp ra mắt trên App Store &amp; Google Play.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 py-2 text-xs font-medium text-[var(--shop-muted)]">
                App Store
              </span>
              <span className="rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 py-2 text-xs font-medium text-[var(--shop-muted)]">
                Google Play
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--shop-primary)] py-3 text-center text-xs font-medium text-white">
        © {new Date().getFullYear()} Đồ ăn sáng &amp; Cafe. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--shop-border)] bg-[var(--landing-section-cream)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:py-14">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
          {/* SP: căn giữa + form full width; lg: cột 1 */}
          <div className="text-center lg:col-span-1 lg:text-left">
            <p className="font-heading text-lg font-bold text-[var(--shop-text)]">Đồ ăn sáng &amp; Cafe</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--shop-muted)]">
              Đặt món online — giao tận nơi, thanh toán khi nhận. Thực đơn đổi mỗi ngày.
            </p>
            <div className="mt-4 flex justify-center gap-3 lg:justify-start">
              <a
                href="#"
                className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-[var(--shop-surface)] text-[var(--shop-muted)] shadow-sm transition hover:text-[var(--shop-primary)] active:opacity-90"
                aria-label="Facebook"
              >
                <span aria-hidden>f</span>
              </a>
              <a
                href="#"
                className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-[var(--shop-surface)] text-[var(--shop-muted)] shadow-sm transition hover:text-[var(--shop-primary)] active:opacity-90"
                aria-label="Zalo"
              >
                <span aria-hidden>Z</span>
              </a>
            </div>
            <form
              className="mx-auto mt-5 flex w-full max-w-md flex-col gap-2 sm:flex-row lg:mx-0 lg:max-w-xs"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="newsletter" className="sr-only">
                Email nhận tin
              </label>
              <input
                id="newsletter"
                type="email"
                placeholder="Email nhận khuyến mãi"
                className="min-h-11 w-full flex-1 rounded-full border border-[var(--shop-border)] bg-[var(--shop-surface)] px-4 text-sm text-[var(--shop-text)] outline-none ring-0 placeholder:text-[var(--shop-muted)] focus:border-[var(--shop-primary)]"
              />
              <button
                type="submit"
                className="min-h-11 w-full shrink-0 rounded-full bg-[var(--shop-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--shop-primary-hover)] active:opacity-95 sm:w-auto sm:px-5"
              >
                Đăng ký
              </button>
            </form>
          </div>

          {/* SP: 2 cột Liên hệ | Bắt đầu, hàng 2 full width Tải app; md–lg: 2×2; lg: 3 cột ngang */}
          <div className="grid grid-cols-2 gap-6 gap-y-8 sm:gap-8 md:grid-cols-2 lg:col-span-3 lg:grid-cols-3 lg:gap-6">
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--shop-text)]">Liên hệ</p>
              <ul className="mt-3 space-y-2.5 text-sm leading-snug text-[var(--shop-muted)] sm:mt-4">
                <li className="break-words">123 Đường ABC, Quận 1, TP.HCM</li>
                <li>
                  <a
                    href="tel:0281234567"
                    className="inline-block rounded-sm hover:text-[var(--shop-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-primary)]"
                  >
                    028 1234 567
                  </a>
                </li>
                <li className="min-w-0 break-all">
                  <a
                    href="mailto:hello@example.com"
                    className="rounded-sm hover:text-[var(--shop-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-primary)]"
                  >
                    hello@example.com
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex min-w-0 flex-col items-stretch sm:items-start lg:items-start">
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--shop-text)]">Bắt đầu</p>
              <Link
                href="/order"
                className="mt-3 inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-full bg-[var(--shop-primary)] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[var(--shop-primary-hover)] active:opacity-95 sm:mt-4 sm:w-auto sm:justify-center"
              >
                Đặt món ngay
              </Link>
            </div>
            <div className="col-span-2 min-w-0 text-center sm:text-left lg:col-span-1 lg:text-left">
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--shop-text)]">Tải ứng dụng</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--shop-muted)] sm:mt-3">
                Sắp ra mắt trên App Store &amp; Google Play.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 py-2.5 text-xs font-medium text-[var(--shop-muted)]">
                  App Store
                </span>
                <span className="rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 py-2.5 text-xs font-medium text-[var(--shop-muted)]">
                  Google Play
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--shop-primary)] px-4 py-3.5 text-center text-[0.6875rem] font-medium leading-snug text-white sm:text-xs">
        © {new Date().getFullYear()} Đồ ăn sáng &amp; Cafe. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}

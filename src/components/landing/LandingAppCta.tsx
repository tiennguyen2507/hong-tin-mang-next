import Link from "next/link";

export function LandingAppCta() {
  return (
    <section className="border-t border-[var(--shop-border)] bg-white py-12 md:py-16 dark:bg-[var(--shop-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFE8D6] via-[#FFF0E6] to-[var(--landing-orange)] p-8 shadow-lg md:p-12 md:pr-8 dark:from-[#2a343f] dark:via-[#252e38] dark:to-[#1a2228] dark:shadow-black/25 dark:ring-1 dark:ring-[var(--shop-border)]">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="text-center lg:text-left">
              <h2 className="font-heading text-2xl font-bold text-[var(--shop-text)] md:text-3xl lg:max-w-md">
                Khám phá thực đơn gần bạn!
              </h2>
              <p className="mt-3 text-[var(--shop-muted)]">
                Hàng trăm món được cập nhật — đặt trên điện thoại hay máy tính đều mượt.
              </p>
              <Link
                href="/order"
                className="mt-6 inline-flex rounded-full bg-[var(--shop-surface)] px-7 py-3 text-base font-bold text-[var(--shop-primary)] shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                Đặt hàng ngay
              </Link>
            </div>
            <div className="relative mx-auto flex max-w-sm justify-center lg:max-w-none">
              <div className="relative aspect-[9/16] w-[min(100%,220px)] rounded-[2rem] border-4 border-white/80 bg-stone-900 shadow-2xl">
                <div className="absolute inset-0 flex flex-col rounded-[1.75rem] bg-gradient-to-b from-stone-800 to-stone-950 p-4 pt-10">
                  <div className="mx-auto h-1 w-12 rounded-full bg-white/20" />
                  <div className="mt-6 space-y-2 px-1">
                    <div className="h-3 w-3/4 rounded-full bg-orange-400/40" />
                    <div className="h-3 w-1/2 rounded-full bg-white/10" />
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="aspect-square rounded-xl bg-orange-500/30" />
                      <div className="aspect-square rounded-xl bg-amber-500/25" />
                    </div>
                  </div>
                  <span className="mt-auto pb-2 text-center text-[10px] text-white/40">Đặt món · Demo</span>
                </div>
              </div>
              <span className="absolute -right-2 top-8 text-5xl drop-shadow-md md:text-6xl" aria-hidden>
                👨‍🍳
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

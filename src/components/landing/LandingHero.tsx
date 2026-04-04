import Image from "next/image";
import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-14 md:pt-12 md:pb-20">
      <div
        className="pointer-events-none absolute -right-20 top-24 h-[28rem] w-[28rem] rounded-full bg-[var(--landing-orange)]/15 blur-3xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div className="max-w-xl">
          <h1 className="font-heading text-[2rem] font-extrabold leading-[1.15] tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            Nâng tầm{" "}
            <span className="text-[var(--landing-orange)]">kinh doanh đồ ăn</span> của bạn ngay!
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            Đặt đồ ăn sáng, cafe và nước uống trực tuyến — giao tận nơi, minh bạch và nhanh chóng.
          </p>
          <Link
            href="/order"
            className="mt-8 inline-flex rounded-full bg-[var(--landing-orange)] px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_40px_rgba(242,140,51,0.35)] transition hover:-translate-y-1 hover:bg-[#e07d28]"
          >
            Bắt đầu ngay
          </Link>
        </div>
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-[85%] w-[90%] rounded-[2.5rem] bg-gradient-to-br from-orange-100/90 to-amber-50/60 blur-[2px]"
            aria-hidden
          />
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl shadow-orange-900/10 ring-1 ring-orange-100/80">
            <Image
              src="/landing-hero.jpg"
              alt="Ly cà phê nóng, hơi thơm bay lên"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

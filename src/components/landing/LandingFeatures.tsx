const items = [
  {
    title: "Theo dõi đơn hàng",
    desc: "Luồng đặt hàng rõ ràng từ giỏ đến xác nhận — dễ kiểm tra món và tổng tiền.",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Thực đơn & giá minh bạch",
    desc: "Danh mục theo loại món, mô tả và giá hiển thị chuẩn — phù hợp đặt nhanh trên mobile.",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round" />
        <rect x="14" y="9" width="6" height="10" rx="1" />
      </svg>
    ),
  },
  {
    title: "Giới thiệu bạn bè",
    desc: "Chia sẻ cửa hàng với người thân — cùng đặt nhóm hoặc lưu lại cho lần sau.",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-24 bg-[var(--landing-section-cream)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="font-heading text-center text-sm font-bold uppercase tracking-[0.2em] text-[var(--landing-orange)]">
          Tính năng
        </p>
        <h2 className="font-heading mt-2 text-center text-3xl font-bold text-stone-900 md:text-4xl">
          Vì sao chọn chúng tôi?
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <article
              key={f.title}
              className="rounded-3xl border border-orange-100/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md md:p-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[var(--landing-orange)]">
                {f.icon}
              </div>
              <h3 className="font-heading mt-5 text-lg font-bold text-stone-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

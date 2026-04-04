export function ShopHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--shop-border)] bg-gradient-to-br from-orange-50 via-amber-50/90 to-[#fff7ed] px-5 py-8 shadow-[0_8px_30px_rgb(234,88,12,0.08)] sm:px-8 sm:py-10">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl"
        aria-hidden
      />
      <div className="relative max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700/90">
          Đặt món online
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-[var(--shop-text)] sm:text-4xl">
          Đồ ăn sáng, cafe &amp; nước uống
          <span className="block text-2xl font-semibold text-orange-700 sm:text-3xl">
            Giao tận nơi — nóng hổi như tại quầy
          </span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--shop-muted)]">
          Chọn món yêu thích, thêm vào giỏ và điền địa chỉ. Phong cách giao diện quen thuộc, dễ đặt trên
          điện thoại như các app bán hàng tại Việt Nam.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {["Giao trong ngày", "Thanh toán khi nhận hàng", "Ưu đãi combo"].map((label) => (
            <li
              key={label}
              className="rounded-full border border-orange-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-orange-900 shadow-sm backdrop-blur-sm"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

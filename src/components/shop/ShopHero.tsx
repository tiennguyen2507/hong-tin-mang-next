export function ShopHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--shop-border)] bg-gradient-to-br from-orange-50 via-amber-50/90 to-[#fff7ed] px-4 py-5 shadow-[0_8px_30px_rgb(234,88,12,0.08)] sm:px-6 sm:py-6">
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
        <h1 className="mt-1.5 text-2xl font-bold leading-snug tracking-tight text-[var(--shop-text)] sm:text-3xl">
          Đồ ăn sáng, cafe &amp; nước uống
          <span className="block text-lg font-semibold text-orange-700 sm:text-2xl">
            Giao tận nơi — nóng hổi như tại quầy
          </span>
        </h1>
        <p className="mt-2 text-sm leading-snug text-[var(--shop-muted)] sm:text-base">
          Chọn món yêu thích, thêm vào giỏ và điền địa chỉ. Đặt nhanh trên điện thoại hoặc máy tính.
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
          {["Giao trong ngày", "Thanh toán khi nhận hàng", "Ưu đãi combo"].map((label) => (
            <li
              key={label}
              className="rounded-full border border-orange-200/80 bg-white/80 px-2.5 py-1 text-[0.65rem] font-medium text-orange-900 shadow-sm backdrop-blur-sm sm:px-3 sm:text-xs"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

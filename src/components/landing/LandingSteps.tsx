import Link from "next/link";

const steps = [
  {
    title: "Chọn món yêu thích",
    body: "Xem thực đơn đồ ăn sáng, cafe và nước uống — có giá và mô tả rõ ràng.",
    align: "left" as const,
    visual: "🛒",
  },
  {
    title: "Thêm giỏ & địa chỉ",
    body: "Điều chỉnh số lượng, nhập địa chỉ giao hàng và ghi chú cho cửa hàng.",
    align: "right" as const,
    visual: "📍",
  },
  {
    title: "Xác nhận đơn hàng",
    body: "Kiểm tra tổng tiền một lần nữa rồi gửi đơn — chúng tôi nhận và xử lý ngay.",
    align: "left" as const,
    visual: "✓",
  },
  {
    title: "Nhận món tại nhà",
    body: "Giao trong khung giờ bạn chọn — thanh toán khi nhận, an tâm tuyệt đối.",
    align: "right" as const,
    visual: "🛵",
  },
];

export function LandingSteps() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-t border-[var(--shop-border)] bg-[var(--landing-section-cream)] py-16 md:py-24 dark:bg-[var(--shop-bg)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-heading text-center text-3xl font-bold text-[var(--shop-text)] md:text-4xl">
          Cách đặt hàng
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--shop-muted)]">
          Bốn bước đơn giản — từ màn hình đến bàn ăn của bạn.
        </p>

        <div className="relative mx-auto mt-14 max-w-5xl">
          <div
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-0 -translate-x-1/2 border-l-2 border-dashed border-[var(--shop-border)] md:block"
            aria-hidden
          />
          <ul className="relative grid gap-12 md:gap-16">
            {steps.map((s, i) => {
              const textFirst = s.align === "left";
              return (
                <li key={s.title} className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
                  <div
                    className={`rounded-3xl border border-orange-100/90 bg-white p-6 shadow-sm md:p-8 dark:border-[var(--shop-border)] dark:bg-[var(--shop-surface)] ${
                      textFirst ? "" : "md:order-2 md:text-right"
                    }`}
                  >
                    <span className="font-heading text-sm font-bold text-[var(--landing-orange)]">
                      Bước {i + 1}
                    </span>
                    <h3 className="font-heading mt-2 text-xl font-bold text-[var(--shop-text)] md:text-2xl">{s.title}</h3>
                    <p className="mt-3 leading-relaxed text-[var(--shop-muted)]">{s.body}</p>
                    {i === steps.length - 1 ? (
                      <div className={`mt-5 ${textFirst ? "" : "flex justify-end"}`}>
                        <Link
                          href="/order"
                          className="inline-flex rounded-full bg-[var(--shop-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--shop-primary-hover)]"
                        >
                          Đặt món ngay
                        </Link>
                      </div>
                    ) : null}
                  </div>
                  <div
                    className={`flex min-h-[140px] items-center justify-center rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 text-6xl shadow-inner md:min-h-[180px] dark:from-[var(--landing-peach)] dark:to-[var(--landing-cream)] ${
                      textFirst ? "" : "md:order-1"
                    }`}
                    aria-hidden
                  >
                    {s.visual}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

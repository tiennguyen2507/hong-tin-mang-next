import Link from "next/link";

const trust = [
  { title: "Giao hàng tận nơi", desc: "Khu vực nội thành" },
  { title: "Đặt online nhanh", desc: "Chọn món — thanh toán khi nhận" },
  { title: "Thực đơn mỗi ngày", desc: "Đồ ăn sáng, cafe & nước uống" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--shop-border)] bg-[var(--shop-surface)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-5">
        <div className="grid gap-8 sm:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title} className="text-center sm:text-left">
              <p className="font-semibold text-[var(--shop-text)]">{t.title}</p>
              <p className="mt-1 text-sm text-[var(--shop-muted)]">{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--shop-border)] pt-8 text-sm text-[var(--shop-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} Đồ ăn sáng &amp; Cafe. Giao tận tay — đặt là có.</p>
          <div className="flex flex-wrap justify-center gap-4 font-medium text-[var(--shop-text)]">
            <Link href="/" className="hover:text-[var(--shop-primary)]">
              Thực đơn
            </Link>
            <Link href="/cart" className="hover:text-[var(--shop-primary)]">
              Giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

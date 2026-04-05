"use client";

import * as React from "react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatGrid } from "@/components/dashboard/StatGrid";
import { Stack } from "@/components/ui/Stack";
import { apiJson } from "@/lib/apiClient";

export default function DashboardOverviewPage() {
  const [stats, setStats] = React.useState<{
    products: number;
    users: number;
    orders: number;
    pending: number;
  } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pr, us, or] = await Promise.all([
          apiJson<{ data: unknown[] }>("/api/products?all=1"),
          apiJson<{ data: unknown[] }>("/api/users"),
          apiJson<{ data: { status: string }[] }>("/api/orders"),
        ]);
        if (cancelled) return;
        const pending = or.data.filter((x) => x.status === "pending").length;
        setStats({
          products: pr.data.length,
          users: us.data.length,
          orders: or.data.length,
          pending,
        });
      } catch {
        if (!cancelled) setStats(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Stack gap={5}>
      <div>
        <h1 className="text-xl font-semibold text-[var(--shop-text)]">Tổng quan</h1>
        <p className="mt-1 text-sm text-[var(--shop-muted)]">
          Chọn mục trong sidebar để quản lý sản phẩm, người dùng và đơn hàng.
        </p>
      </div>

      <StatGrid>
        <StatCard
          label="Sản phẩm"
          value={stats?.products ?? "—"}
          hint="Tổng trong kho"
          hintTone="neutral"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          label="Người dùng"
          value={stats?.users ?? "—"}
          hint="Khách / quản trị"
          hintTone="neutral"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          label="Đơn chờ xử lý"
          value={stats?.pending ?? "—"}
          hint={stats ? `${stats.orders} đơn tổng` : "—"}
          hintTone="neutral"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </StatGrid>

      <div className="grid gap-2 sm:grid-cols-3">
        <Link
          href="/dashboard/products"
          className="rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-4 py-3 text-sm font-medium text-[var(--shop-primary)] shadow-sm transition hover:bg-[var(--shop-border)]/25"
        >
          Quản lý sản phẩm →
        </Link>
        <Link
          href="/dashboard/users"
          className="rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-4 py-3 text-sm font-medium text-[var(--shop-primary)] shadow-sm transition hover:bg-[var(--shop-border)]/25"
        >
          Quản lý người dùng →
        </Link>
        <Link
          href="/dashboard/orders"
          className="rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-4 py-3 text-sm font-medium text-[var(--shop-primary)] shadow-sm transition hover:bg-[var(--shop-border)]/25"
        >
          Quản lý đơn hàng →
        </Link>
      </div>
    </Stack>
  );
}

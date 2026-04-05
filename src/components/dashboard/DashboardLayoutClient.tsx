"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { OutlineLink } from "@/components/ui/OutlineLink";
import { Cluster } from "@/components/ui/Cluster";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { apiJson } from "@/lib/apiClient";

function todayLabel() {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userLabel, setUserLabel] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const r = await apiJson<{ user: { name: string; email: string } }>("/api/auth/me");
        if (!cancelled) setUserLabel(`${r.user.name} · ${r.user.email}`);
      } catch {
        if (!cancelled) setUserLabel(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onLogout() {
    try {
      await apiJson("/api/auth/logout", { method: "POST" });
    } catch {
      /* vẫn xóa cookie phía client nếu API lỗi — cookie httpOnly chỉ xóa qua API */
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-[var(--dashboard-bg)] transition-colors duration-300">
      <DashboardShell
        onLogout={() => void onLogout()}
        toolbar={
          <Cluster gap={2}>
            <span className="rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 py-2 text-xs font-medium text-[var(--shop-muted)] shadow-sm">
              {todayLabel()}
            </span>
            {userLabel ? (
              <span className="hidden max-w-[220px] truncate rounded-xl border border-[var(--shop-border)] bg-[var(--shop-surface)] px-3 py-2 text-xs text-[var(--shop-muted)] shadow-sm sm:inline">
                {userLabel}
              </span>
            ) : null}
            <ThemeToggle />
            <OutlineLink href="/order">Về cửa hàng</OutlineLink>
          </Cluster>
        }
      >
        {children}
      </DashboardShell>
    </div>
  );
}

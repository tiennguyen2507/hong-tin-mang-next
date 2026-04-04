"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Card, CardTitle } from "@/components/ui/Card";
import { CenteredPanel } from "@/components/ui/CenteredPanel";
import { Cluster } from "@/components/ui/Cluster";
import { OutlineLink } from "@/components/ui/OutlineLink";
import { useLocalStore } from "@/hooks/useLocalStore";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

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
  const [dashboardAuth, setDashboardAuth, authHydrated] = useLocalStore<{
    ok: boolean;
  }>("htm.shop.dashboard.auth", { ok: false });
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState<string | null>(null);

  function onUnlock(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    if (password !== "helloword") {
      setAuthError("Sai mật khẩu.");
      return;
    }
    setDashboardAuth({ ok: true });
    setPassword("");
  }

  if (!authHydrated) {
    return (
      <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-[#f4f6f9]">
        <CenteredPanel>
          <Card>
            <p className="text-sm text-slate-600">Đang tải...</p>
          </Card>
        </CenteredPanel>
      </div>
    );
  }

  if (!dashboardAuth.ok) {
    return (
      <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-[#f4f6f9]">
        <CenteredPanel>
          <Card>
            <CardTitle>Quản trị cửa hàng</CardTitle>
            <p className="mt-1 text-sm text-slate-600">
              Nhập mật khẩu để vào bảng điều khiển.
            </p>
            <form className="mt-4 grid gap-2.5" onSubmit={onUnlock}>
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {authError ? <Alert variant="destructive">{authError}</Alert> : null}
              <Button type="submit" size="sm">
                Mở khóa
              </Button>
            </form>
          </Card>
        </CenteredPanel>
      </div>
    );
  }

  return (
    <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-[#f4f6f9]">
      <DashboardShell
        onLogout={() => setDashboardAuth({ ok: false })}
        toolbar={
          <Cluster gap={2}>
            <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
              {todayLabel()}
            </span>
            <OutlineLink href="/order">Về cửa hàng</OutlineLink>
          </Cluster>
        }
      >
        {children}
      </DashboardShell>
    </div>
  );
}

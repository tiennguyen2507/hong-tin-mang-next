"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Card, CardTitle } from "@/components/ui/Card";
import { CenteredPanel } from "@/components/ui/CenteredPanel";
import { Field } from "@/components/ui/Field";
import { apiJson } from "@/lib/apiClient";

function errorMessage(code: string | null) {
  switch (code) {
    case "config":
      return "Máy chủ chưa cấu hình AUTH_SECRET. Thêm biến môi trường và khởi động lại.";
    case "forbidden":
      return "Tài khoản không có quyền quản trị.";
    case "session":
      return "Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.";
    default:
      return null;
  }
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "";
  const errParam = searchParams.get("error");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(errorMessage(errParam));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const r = await apiJson<{
        user: { role: string };
      }>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (r.user.role === "admin") {
        if (nextPath.startsWith("/dashboard")) router.push(nextPath);
        else router.push("/dashboard");
      } else {
        router.push("/order");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đăng nhập thất bại");
    } finally {
      setBusy(false);
    }
  }

  return (
    <CenteredPanel>
      <Card className="w-full max-w-md">
        <CardTitle>Đăng nhập</CardTitle>
        <p className="mt-1 text-sm text-[var(--shop-muted)]">
          Quản trị viên đăng nhập để vào bảng điều khiển. Người dùng thường có thể đăng nhập để dùng tính năng sau
          này.
        </p>
        {error ? (
          <Alert className="mt-4" variant="destructive">
            {error}
          </Alert>
        ) : null}
        <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
          <Field id="login-email" label="Email">
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field id="login-password" label="Mật khẩu">
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button type="submit" className="w-full bg-[var(--shop-primary)] hover:bg-[var(--shop-primary-hover)]" disabled={busy}>
            {busy ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--shop-muted)]">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-semibold text-[var(--shop-primary)] hover:underline">
            Đăng ký
          </Link>
        </p>
      </Card>
    </CenteredPanel>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Card, CardTitle } from "@/components/ui/Card";
import { CenteredPanel } from "@/components/ui/CenteredPanel";
import { Field } from "@/components/ui/Field";
import { apiJson } from "@/lib/apiClient";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setBusy(true);
    try {
      const r = await apiJson<{ user: { role: string } }>("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (r.user.role === "admin") router.push("/dashboard");
      else router.push("/order");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đăng ký thất bại");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[var(--shop-bg)] py-10 transition-colors duration-300">
      <CenteredPanel>
        <Card className="w-full max-w-md">
          <CardTitle>Đăng ký</CardTitle>
          <p className="mt-1 text-sm text-[var(--shop-muted)]">
            Tài khoản <strong>đầu tiên</strong> trong hệ thống sẽ tự trở thành quản trị viên. Các tài khoản sau là
            người dùng thường (admin có thể đổi vai trò trong mục Người dùng).
          </p>
          {error ? (
            <Alert className="mt-4" variant="destructive">
              {error}
            </Alert>
          ) : null}
          <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
            <Field id="reg-name" label="Họ và tên">
              <Input
                id="reg-name"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field id="reg-email" label="Email">
              <Input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field id="reg-password" label="Mật khẩu (tối thiểu 8 ký tự)">
              <Input
                id="reg-password"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Field id="reg-confirm" label="Xác nhận mật khẩu">
              <Input
                id="reg-confirm"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full bg-[var(--shop-primary)] hover:bg-[var(--shop-primary-hover)]" disabled={busy}>
              {busy ? "Đang tạo tài khoản..." : "Đăng ký"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[var(--shop-muted)]">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-[var(--shop-primary)] hover:underline">
              Đăng nhập
            </Link>
          </p>
        </Card>
      </CenteredPanel>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/cn";
import { apiJson } from "@/lib/apiClient";

type MeUser = { name: string; email: string; role: string };

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0];
    const b = parts[parts.length - 1][0];
    if (a && b) return (a + b).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  const c = name.trim()[0];
  return c ? c.toUpperCase() : "?";
}

export function UserMenuDropdown() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<MeUser | null | undefined>(undefined);
  const [busy, setBusy] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const loadMe = React.useCallback(async () => {
    try {
      const r = await apiJson<{ user: MeUser }>("/api/auth/me");
      setUser(r.user);
    } catch {
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    void loadMe();
  }, [loadMe]);

  React.useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  async function onLogout() {
    setBusy(true);
    try {
      await apiJson("/api/auth/logout", { method: "POST" });
    } catch {
      /* cookie httpOnly — vẫn refresh */
    }
    setUser(null);
    setOpen(false);
    router.refresh();
    setBusy(false);
  }

  const label = user ? initialsFromName(user.name) : "?";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={user ? `Tài khoản ${user.name}` : "Tài khoản"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--shop-border)] bg-linear-to-br from-[var(--landing-peach)]/80 to-[#abdde6]/50 text-sm font-bold text-[var(--shop-text)] shadow-sm transition",
          "hover:border-[var(--shop-primary)] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--shop-bg)]",
          "dark:from-[#2a343c] dark:to-[#223038] dark:text-[var(--foreground)]",
        )}
      >
        {user === undefined ? (
          <span className="h-4 w-4 animate-pulse rounded-full bg-[var(--shop-primary)]/30" aria-hidden />
        ) : user === null ? (
          <svg
            className="h-5 w-5 text-[var(--shop-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ) : (
          <span aria-hidden>{label}</span>
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-56 rounded-2xl border border-[var(--shop-border)] bg-[var(--shop-surface)] py-2 shadow-lg shadow-black/10 ring-1 ring-black/5 dark:shadow-black/40"
        >
          {user === undefined ? (
            <div className="px-4 py-3 text-sm text-[var(--shop-muted)]">Đang tải...</div>
          ) : user ? (
            <>
              <div className="border-b border-[var(--shop-border)] px-4 py-3">
                <p className="truncate text-sm font-semibold text-[var(--shop-text)]">{user.name}</p>
                <p className="truncate text-xs text-[var(--shop-muted)]">{user.email}</p>
                {user.role === "admin" ? (
                  <span className="mt-1.5 inline-block rounded-full bg-[var(--shop-primary)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--shop-primary)]">
                    Quản trị
                  </span>
                ) : null}
              </div>
              <div className="py-1">
                {user.role === "admin" ? (
                  <Link
                    role="menuitem"
                    href="/dashboard"
                    className="block px-4 py-2.5 text-sm font-medium text-[var(--shop-text)] transition hover:bg-[var(--landing-peach)]/50 dark:hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    Bảng quản trị
                  </Link>
                ) : null}
                <button
                  type="button"
                  role="menuitem"
                  disabled={busy}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-[var(--shop-text)] transition hover:bg-[var(--shop-border)]/40 disabled:opacity-50 dark:hover:bg-white/5"
                  onClick={() => void onLogout()}
                >
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <Link
                role="menuitem"
                href="/login"
                className="block px-4 py-2.5 text-sm font-semibold text-[var(--shop-text)] transition hover:bg-[var(--landing-peach)]/50 dark:hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                role="menuitem"
                href="/register"
                className="block px-4 py-2.5 text-sm font-medium text-[var(--shop-text)] transition hover:bg-[var(--landing-peach)]/50 dark:hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

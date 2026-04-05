"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

function IconHome() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function IconBox() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

const linkClass = (active: boolean) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    active
      ? "bg-[var(--shop-primary)]/15 text-[var(--shop-primary)]"
      : "text-[var(--shop-muted)] hover:bg-[var(--shop-border)]/35 hover:text-[var(--shop-text)] dark:hover:bg-white/5"
  }`;

export type DashboardShellProps = {
  children: React.ReactNode;
  onLogout?: () => void;
  toolbar?: React.ReactNode;
};

function isActiveNav(href: string, pathname: string | null) {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children, onLogout, toolbar }: DashboardShellProps) {
  const pathname = usePathname();

  const adminLinks = [
    { href: "/dashboard", label: "Tổng quan", icon: <IconChart /> },
    { href: "/dashboard/products", label: "Sản phẩm", icon: <IconBox /> },
    { href: "/dashboard/users", label: "Người dùng", icon: <IconUsers /> },
    { href: "/dashboard/orders", label: "Đơn hàng", icon: <IconClipboard /> },
  ] as const;

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden lg:flex-row">
      <aside className="flex shrink-0 flex-col overflow-y-auto border-b border-[var(--shop-border)] bg-[var(--dashboard-shell-bg)] transition-colors lg:h-full lg:w-[240px] lg:border-b-0 lg:border-r">
        <div className="flex flex-row items-center gap-2 p-3 lg:flex-col lg:items-stretch lg:p-4">
          <Link
            href="/order"
            className="flex shrink-0 items-center gap-2 rounded-xl px-1 py-1"
          >
            <Image
              src="/logo.png"
              alt="Đồ ăn sáng & Cafe"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </Link>

          <nav className="ml-auto flex flex-1 flex-wrap justify-end gap-1 lg:ml-0 lg:mt-2 lg:flex-col lg:justify-start">
            <Link
              href="/order"
              className={linkClass(pathname === "/order")}
            >
              <IconHome />
              <span className="hidden sm:inline">Cửa hàng</span>
            </Link>

            <p className="hidden px-3 pt-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--shop-muted)] lg:block">
              Quản trị
            </p>
            {adminLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(isActiveNav(item.href, pathname))}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}

            <span className="hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--shop-muted)] lg:flex">
              <IconSettings />
              Cài đặt
            </span>
          </nav>
        </div>

        {toolbar ? (
          <div className="border-t border-[var(--shop-border)] px-3 py-3 lg:px-4">{toolbar}</div>
        ) : null}

        <div className="mt-auto hidden w-full flex-col gap-3 border-t border-[var(--shop-border)] p-4 lg:flex">
          <div className="rounded-2xl bg-linear-to-br from-[var(--shop-primary)]/15 to-[#cbaacb]/20 p-4 dark:from-[var(--shop-primary)]/10 dark:to-[#2a3038]">
            <p className="text-sm font-semibold text-[var(--shop-text)]">Nâng cấp Pro</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--shop-muted)]">
              Mở khóa thống kê nâng cao và xuất báo cáo.
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-xl bg-[var(--shop-primary)] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--shop-primary-hover)]"
            >
              Nâng cấp
            </button>
          </div>
          <div className="flex flex-col gap-1 text-sm text-[var(--shop-muted)]">
            <span>Trợ giúp</span>
            <button
              type="button"
              onClick={onLogout}
              className="text-left text-[var(--shop-text)] transition hover:text-[var(--shop-primary)]"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[var(--dashboard-bg)] p-3 transition-colors sm:p-4">
        {children}
      </main>
    </div>
  );
}

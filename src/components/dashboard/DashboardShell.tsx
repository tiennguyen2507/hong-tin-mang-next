"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

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

function IconNews() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  );
}

function IconTasks() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
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

export type DashboardShellProps = {
  children: React.ReactNode;
  onLogout?: () => void;
  toolbar?: React.ReactNode;
};

export function DashboardShell({ children, onLogout, toolbar }: DashboardShellProps) {
  const nav: NavItem[] = [
    { href: "/news", label: "Trang tin", icon: <IconNews />, active: false },
    {
      href: "/dashboard",
      label: "Quản lý tin",
      icon: <IconTasks />,
      active: true,
    },
  ];

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden lg:flex-row">
      {/* Sidebar: fixed height, không cuộn theo main — chỉ cuộn nội bộ nếu quá dài */}
      <aside className="flex shrink-0 flex-col overflow-y-auto border-b border-slate-200/80 bg-white lg:h-full lg:w-[240px] lg:border-b-0 lg:border-r">
        <div className="flex flex-row items-center gap-2 p-3 lg:flex-col lg:items-stretch lg:p-4">
          <Link
            href="/news"
            className="flex shrink-0 items-center gap-2 rounded-xl px-1 py-1"
          >
            <Image
              src="/logo.png"
              alt="Hóng Tin Mạng"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <nav className="ml-auto flex flex-1 flex-wrap justify-end gap-1 lg:ml-0 lg:mt-2 lg:flex-col lg:justify-start">
            <Link
              href="/news"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <IconHome />
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  item.active
                    ? "bg-[#e8f0fe] text-[#1a56db]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
            <span className="hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 lg:flex">
              <IconSettings />
              Cài đặt
            </span>
          </nav>
        </div>

        {toolbar ? (
          <div className="border-t border-slate-100 px-3 py-3 lg:px-4">{toolbar}</div>
        ) : null}

        <div className="mt-auto hidden w-full flex-col gap-3 border-t border-slate-100 p-4 lg:flex">
          <div className="rounded-2xl bg-linear-to-br from-[#dbeafe] to-[#e0e7ff] p-4">
            <p className="text-sm font-semibold text-slate-800">Nâng cấp Pro</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Mở khóa thống kê nâng cao và xuất báo cáo.
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-xl bg-[#2563eb] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
            >
              Nâng cấp
            </button>
          </div>
          <div className="flex flex-col gap-1 text-sm text-slate-500">
            <span>Trợ giúp</span>
            <button
              type="button"
              onClick={onLogout}
              className="text-left text-slate-700 transition hover:text-[#1a56db]"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main: chỉ vùng này cuộn */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <main className="min-h-0 flex-1 overflow-y-auto bg-[#f4f6f9] p-3 sm:p-4 lg:border-r lg:border-slate-200/80">
          {children}
        </main>

        {/* Right rail: cố định theo chiều cao viewport, cuộn riêng nếu nội dung dài */}
        <aside className="hidden min-h-0 w-[280px] shrink-0 overflow-y-auto border-slate-200/80 bg-white lg:flex lg:flex-col lg:p-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#93c5fd] to-[#60a5fa] text-sm font-bold text-white">
                HT
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  Biên tập viên
                </p>
                <p className="truncate text-xs text-slate-500">@hongtinmang</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 shadow-sm"
              >
                Gọi
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 shadow-sm"
              >
                Chat
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Hoạt động
            </p>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <span>Đồng bộ tin tức từ API Railway.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                <span>Chỉnh sửa hoặc ẩn bài trong danh sách bên trái.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                <span>Xem trước bài trên trang công khai.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

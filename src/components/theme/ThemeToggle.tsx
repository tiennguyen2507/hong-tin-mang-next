"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { cn } from "@/lib/cn";

function IconSun() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--header-border)] bg-[var(--header-toggle-bg)]",
          className,
        )}
        aria-hidden
      />
    );
  }

  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--header-border)] bg-[var(--header-toggle-bg)] text-[var(--shop-text)] shadow-sm transition",
        "hover:border-[var(--shop-primary)] hover:text-[var(--shop-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--shop-bg)]",
        className,
      )}
      aria-label={dark ? "Chuyển sáng giao diện sáng" : "Chuyển sang giao diện tối"}
    >
      {dark ? <IconSun /> : <IconMoon />}
    </button>
  );
}

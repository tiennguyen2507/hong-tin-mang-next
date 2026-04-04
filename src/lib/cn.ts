import { twMerge } from "tailwind-merge";

/** Gộp class Tailwind và xử lý xung đột (vd: `dark:bg-zinc-950` vs `dark:bg-white`). */
export function cn(...parts: Array<string | undefined | null | false>) {
  return twMerge(parts.filter(Boolean) as string[]);
}

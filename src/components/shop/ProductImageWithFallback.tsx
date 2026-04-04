"use client";

import Image from "next/image";
import * as React from "react";
import type { ProductCategory } from "@/lib/models";
import { cn } from "@/lib/cn";

const catAccent: Record<ProductCategory, string> = {
  breakfast: "from-amber-100 to-orange-50",
  cafe: "from-stone-200 to-amber-100/80",
  drink: "from-sky-100 to-cyan-50",
};

/** Icon ảnh minh họa — khi URL lỗi, không dùng chữ alt làm nội dung khung ảnh */
function PhotoPlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

export type ProductImageWithFallbackProps = {
  src: string;
  /** Dùng cho screen reader; không hiển thị trong khung khi ảnh lỗi */
  alt: string;
  category: ProductCategory;
  sizes: string;
  variant?: "card" | "thumb";
  imgClassName?: string;
};

export function ProductImageWithFallback({
  src,
  alt,
  category,
  sizes,
  variant = "card",
  imgClassName,
}: ProductImageWithFallbackProps) {
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  const iconSize = variant === "thumb" ? "h-6 w-6" : "h-14 w-14";

  if (failed) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-gradient-to-br text-stone-400",
          catAccent[category],
        )}
        role="img"
        aria-label={alt}
      >
        <PhotoPlaceholderIcon className={cn(iconSize, "opacity-55")} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", imgClassName)}
      sizes={sizes}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

import type { Metadata } from "next";
import { LandingAppCta } from "@/components/landing/LandingAppCta";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPrivacy } from "@/components/landing/LandingPrivacy";
import { LandingSteps } from "@/components/landing/LandingSteps";

export const metadata: Metadata = {
  title: "Trang chủ — Đồ ăn sáng & Cafe",
  description: "Đặt đồ ăn sáng, cafe và nước uống online. Giao tận nơi, thanh toán khi nhận.",
};

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingSteps />
      <LandingAppCta />
      <LandingFeatures />
      <LandingPrivacy />
    </>
  );
}

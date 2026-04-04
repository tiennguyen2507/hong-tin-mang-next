import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API — Swagger",
  description: "Tài liệu OpenAPI / Swagger cho REST API",
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

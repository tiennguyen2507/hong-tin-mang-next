"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-[var(--shop-muted)]">
      Đang tải tài liệu API…
    </div>
  ),
});

export default function ApiDocsPage() {
  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <div className="border-b border-[var(--shop-border)] bg-[var(--shop-surface)] px-4 py-4 sm:px-6">
        <h1 className="font-heading text-lg font-bold text-[var(--shop-text)] sm:text-xl">Tài liệu API</h1>
        <p className="mt-1 text-sm text-[var(--shop-muted)]">OpenAPI / Swagger — thử endpoint trực tiếp bên dưới.</p>
      </div>
      <div className="swagger-wrap min-h-[60vh]">
        <SwaggerUI url="/openapi.json" docExpansion="list" defaultModelsExpandDepth={2} />
      </div>
    </div>
  );
}

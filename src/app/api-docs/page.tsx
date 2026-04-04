"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[50vh] items-center justify-center text-neutral-500">
      Đang tải tài liệu API…
    </div>
  ),
});

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <SwaggerUI url="/openapi.json" docExpansion="list" defaultModelsExpandDepth={2} />
    </div>
  );
}

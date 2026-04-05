import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[var(--shop-bg)] py-10 transition-colors duration-300">
      <Suspense
        fallback={
          <div className="flex flex-1 flex-col items-center justify-center text-sm text-[var(--shop-muted)]">
            Đang tải...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

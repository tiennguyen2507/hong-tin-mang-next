import Image from "next/image";
import Link from "next/link";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-zinc-200/60 bg-zinc-50/80 backdrop-blur dark:border-zinc-800/60 dark:bg-black/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Hóng Tin Mạng"
              width={140}
              height={44}
              priority
              className="h-9 w-auto"
            />
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl flex-1 px-3 py-5 sm:px-4 sm:py-8">
          {children}
        </div>
      </main>
    </>
  );
}

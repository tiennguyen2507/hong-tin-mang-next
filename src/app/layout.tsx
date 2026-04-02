import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "News",
  description: "News list, detail, and dashboard CRUD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
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
        <main className="flex flex-1">
          <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-4 sm:py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

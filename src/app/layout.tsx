import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist, Geist_Mono, Lora, Poppins } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-order-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Đồ ăn sáng & Cafe",
  description: "Đặt đồ ăn sáng, cafe và nước uống online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${lora.variable} ${poppins.variable} ${beVietnam.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrompTopia — 中文AI实战案例社区",
  description: "看别人怎么用AI做成事。结构化AI创业、副业、编程、Agent实战案例。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Top bar */}
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
          <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
            <Link href="/" className="font-bold text-lg tracking-tight">
              PrompTopia
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/" className="hover:underline">案例</Link>
              <Link href="/case/new" className="hover:underline">发布</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t py-6 text-center text-xs text-muted-foreground">
          © PrompTopia · 中文AI实战案例社区
        </footer>

        <Toaster />
      </body>
    </html>
  );
}

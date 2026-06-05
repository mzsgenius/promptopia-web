import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrompTopia — 中文AI实战案例社区",
  description: "看别人怎么用AI做成事。结构化AI创业、副业、编程、Agent实战案例。",
  other: {
    "baidu-site-verification": "codeva-7lXDrQN2eL",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-lg tracking-tight hover:text-primary transition-colors">
                PrompTopia
              </Link>
              <nav className="hidden sm:flex items-center gap-5 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">首页</Link>
                <Link href="/?q=ChatGPT" className="hover:text-foreground transition-colors">ChatGPT</Link>
                <Link href="/tag/Cursor" className="hover:text-foreground transition-colors">Cursor</Link>
                <Link href="/case/new" className="hover:text-foreground transition-colors">发布</Link>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/case/new"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 hover:bg-primary/90 transition-colors"
              >
                发布案例
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t mt-12">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center text-xs text-muted-foreground">
            <p className="mb-1">© PrompTopia · 中文AI实战案例社区</p>
            <p>看别人怎么用AI做成事。</p>
          </div>
        </footer>

        <Toaster />
      </body>
    </html>
  );
}

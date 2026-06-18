// Admin layout — sidebar navigation
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-muted/30 flex-shrink-0 hidden md:block">
        <div className="p-4 border-b">
          <Link href="/admin" className="font-bold text-lg tracking-tight">管理后台</Link>
        </div>
        <nav className="p-2 space-y-1">
          <SidebarLink href="/admin" label="仪表盘" icon="📊" />
          <SidebarLink href="/admin/cases" label="案例管理" icon="📝" />
          <SidebarLink href="/admin/comments" label="评论管理" icon="💬" />
          <SidebarLink href="/admin/users" label="用户管理" icon="👥" />
          <SidebarLink href="/admin/license" label="许可证" icon="🔑" />
          <div className="pt-4 mt-4 border-t">
            <SidebarLink href="/" label="← 返回前台" icon="" />
          </div>
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background flex md:hidden z-50">
        <MobileLink href="/admin" label="仪表盘" icon="📊" />
        <MobileLink href="/admin/cases" label="案例" icon="📝" />
        <MobileLink href="/admin/comments" label="评论" icon="💬" />
        <MobileLink href="/admin/users" label="用户" icon="👥" />
        <MobileLink href="/admin/license" label="许可证" icon="🔑" />
      </div>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
    >
      {icon && <span>{icon}</span>}
      {label}
    </Link>
  );
}

function MobileLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex-1 flex flex-col items-center py-2 text-xs text-muted-foreground hover:text-foreground"
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
}

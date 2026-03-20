import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, LayoutDashboard, ListOrdered, LogOut, Settings, Soup, TableProperties } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categorias", icon: ListOrdered },
  { href: "/admin/dishes", label: "Pratos", icon: Soup },
  { href: "/admin/tables", label: "Mesas", icon: TableProperties },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Configurações", icon: Settings }
];

export function AdminShell({
  restaurantName,
  children
}: {
  restaurantName: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100/80 py-4 sm:py-6">
      <div className="container-shell grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="surface flex flex-col gap-6 p-4 sm:p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin</p>
            <h1 className="mt-2 text-2xl font-bold text-stone-900">{restaurantName}</h1>
          </div>
          <nav className="flex gap-2 overflow-x-auto lg:grid">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-w-fit items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action={logoutAction} className="mt-auto">
            <Button variant="outline" className="min-h-12 w-full justify-center gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </form>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

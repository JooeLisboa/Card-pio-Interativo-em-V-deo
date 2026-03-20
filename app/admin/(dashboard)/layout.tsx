import type { ReactNode } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdmin } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return <AdminShell restaurantName={user.restaurant?.name ?? "Restaurante"}>{children}</AdminShell>;
}

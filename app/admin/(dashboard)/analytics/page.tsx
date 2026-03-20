import { Eye, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/admin/section-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/data";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminAnalyticsPage() {
  const user = await requireAdmin();
  const data = await getAdminDashboardData(user.restaurantId!);

  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics" description="Acompanhe o total de acessos por prato e o ranking dos itens mais vistos." />
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.dishes.length ? data.dishes
            .sort((a, b) => b.viewsCount - a.viewsCount)
            .map((dish, index) => (
              <div key={dish.id} className="rounded-3xl border border-[var(--border)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Ranking #{index + 1}</p>
                    <h3 className="mt-2 text-lg font-bold text-stone-950">{dish.name}</h3>
                    <p className="text-sm text-stone-500">{dish.category.name}</p>
                  </div>
                  <Badge className="bg-stone-950 text-white">
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    {dish.viewsCount}
                  </Badge>
                </div>
                <div className="mt-5 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
                  <div className="flex items-center gap-2 font-semibold text-stone-800">
                    <TrendingUp className="h-4 w-4 text-[var(--primary)]" />
                    Total de acessos registrados
                  </div>
                  <p className="mt-2 leading-6">{dish.viewsCount} visualizações acumuladas neste prato.</p>
                </div>
              </div>
            )) : <p className="text-sm text-stone-500">Sem dados disponíveis.</p>}
        </div>
      </Card>
    </div>
  );
}

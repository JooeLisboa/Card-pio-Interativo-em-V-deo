import Image from "next/image";
import Link from "next/link";
import { Eye, QrCode, UtensilsCrossed } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { SectionHeader } from "@/components/admin/section-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData, getQrCodeDataUrl } from "@/lib/data";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const data = await getAdminDashboardData(user.restaurantId!);
  const restaurantSlug = data.restaurant?.slug ?? "";
  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/menu/${restaurantSlug}`;
  const qrCode = await getQrCodeDataUrl(menuUrl);

  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" description="Visão rápida do cardápio, QR principal e desempenho dos pratos." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Pratos cadastrados" value={data.dishes.length} description="Itens prontos para divulgação e QR individual." />
        <MetricCard label="Visualizações totais" value={data.totalViews} description="Soma dos acessos registrados nas páginas dos pratos." />
        <MetricCard label="Mesas com QR" value={data.tables.length} description="Estrutura preparada para pedidos com referência de mesa." />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_360px]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--primary)]">Top acessos</p>
              <h3 className="mt-1 text-2xl font-black">Pratos mais visualizados</h3>
            </div>
            <Link href="/admin/analytics" className="text-sm font-semibold text-[var(--primary)]">Ver analytics</Link>
          </div>
          <div className="mt-6 grid gap-4">
            {data.topDishes.length ? data.topDishes.map((dish, index) => (
              <div key={dish.id} className="flex items-center justify-between rounded-2xl border border-[var(--border)] p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">#{index + 1}</p>
                  <h4 className="mt-1 font-bold text-stone-950">{dish.name}</h4>
                  <p className="text-sm text-stone-500">{dish.category.name}</p>
                </div>
                <Badge className="bg-stone-950 text-white">
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  {dish.viewsCount}
                </Badge>
              </div>
            )) : <p className="text-sm text-stone-500">Ainda não há visualizações registradas.</p>}
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
            <QrCode className="h-4 w-4" />
            QR do cardápio geral
          </div>
          <div className="mt-4 rounded-3xl bg-stone-50 p-4 text-center">
            <Image src={qrCode} alt="QR do cardápio" width={256} height={256} className="mx-auto rounded-2xl" />
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">Esse QR leva para a página pública principal do restaurante dentro do sistema.</p>
          <Link href={`/menu/${restaurantSlug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
            <UtensilsCrossed className="h-4 w-4" />
            Abrir cardápio público
          </Link>
        </Card>
      </div>
    </div>
  );
}

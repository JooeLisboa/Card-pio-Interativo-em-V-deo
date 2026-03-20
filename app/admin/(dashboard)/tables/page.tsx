import Image from "next/image";
import Link from "next/link";
import { deleteTableAction } from "@/actions/admin";
import { SectionHeader } from "@/components/admin/section-header";
import { TableForm } from "@/components/admin/table-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminDashboardData, getQrCodeDataUrl } from "@/lib/data";
import { buildMenuUrl } from "@/lib/utils";

export default async function AdminTablesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const user = await requireAdmin();
  const data = await getAdminDashboardData(user.restaurantId!);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { edit } = await searchParams;
  const editing = data.tables.find((table) => table.id === edit);

  const tableCards = await Promise.all(
    data.tables.map(async (table) => {
      const publicPath = buildMenuUrl({
        restaurantSlug: data.restaurant?.slug ?? "",
        table: table.code,
      });
      const url = `${baseUrl}${publicPath}`;
      const qrCode = await getQrCodeDataUrl(url);

      return (
        <Card key={table.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">Mesa</p>
              <h3 className="text-2xl font-black text-stone-950">{table.number}</h3>
              <p className="mt-1 text-sm text-stone-500">Código: {table.code}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/admin/tables?edit=${table.id}`}>Editar</Link>
              </Button>
              <form action={deleteTableAction.bind(null, table.id)}>
                <Button variant="danger">Excluir</Button>
              </form>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-stone-50 p-4 text-center">
            <Image
              src={qrCode}
              alt={`QR da mesa ${table.number}`}
              width={180}
              height={180}
              className="mx-auto rounded-2xl"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-[var(--primary)]">
            <a href={qrCode} download={`mesa-${table.number}.png`}>
              Baixar QR
            </a>
            <a href={url} target="_blank" rel="noreferrer">
              Abrir cardápio da mesa
            </a>
          </div>
        </Card>
      );
    }),
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mesas"
        description="Gere QRs de mesa para preservar a referência no cardápio e no WhatsApp."
      />
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)] 2xl:items-start">
        <div className="2xl:sticky 2xl:top-6">
          <TableForm
            defaultValues={
              editing
                ? { id: editing.id, number: editing.number, code: editing.code }
                : undefined
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tableCards.length ? (
            tableCards
          ) : (
            <Card className="p-6 text-sm text-stone-500">
              Nenhuma mesa cadastrada ainda. Gere mesas para validar o fluxo completo via QR e WhatsApp.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

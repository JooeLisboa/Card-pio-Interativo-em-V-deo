import Image from "next/image";
import { deleteTableAction } from "@/actions/admin";
import { SectionHeader } from "@/components/admin/section-header";
import { TableForm } from "@/components/admin/table-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData, getQrCodeDataUrl } from "@/lib/data";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminTablesPage({
  searchParams
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
      const url = `${baseUrl}/menu/${data.restaurant?.slug}?table=${table.number}`;
      const qrCode = await getQrCodeDataUrl(url);

      return (
        <Card key={table.id} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">Mesa</p>
              <h3 className="text-2xl font-black text-stone-950">{table.number}</h3>
              <p className="mt-1 text-sm text-stone-500">Código: {table.code}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline"><a href={`/admin/tables?edit=${table.id}`}>Editar</a></Button>
              <form action={deleteTableAction.bind(null, table.id)}>
                <Button variant="danger">Excluir</Button>
              </form>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-stone-50 p-4 text-center">
            <Image src={qrCode} alt={`QR da mesa ${table.number}`} width={180} height={180} className="mx-auto rounded-2xl" />
          </div>
          <a href={qrCode} download={`mesa-${table.number}.png`} className="mt-3 inline-block text-sm font-semibold text-[var(--primary)]">Baixar QR</a>
        </Card>
      );
    })
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Mesas" description="Gere QRs de mesa para preservar a referência no cardápio e no WhatsApp." />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <TableForm defaultValues={editing ? { id: editing.id, number: editing.number, code: editing.code } : undefined} />
        <div className="grid gap-4 md:grid-cols-2">{tableCards}</div>
      </div>
    </div>
  );
}

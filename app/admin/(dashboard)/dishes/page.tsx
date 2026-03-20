import Image from "next/image";
import { deleteDishAction } from "@/actions/admin";
import { DishForm } from "@/components/admin/dish-form";
import { SectionHeader } from "@/components/admin/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData, getQrCodeDataUrl } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminDishesPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const user = await requireAdmin();
  const data = await getAdminDashboardData(user.restaurantId!);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { edit } = await searchParams;
  const editing = data.dishes.find((dish) => dish.id === edit);

  const dishCards = await Promise.all(
    data.dishes.map(async (dish) => {
      const url = `${baseUrl}/menu/${data.restaurant?.slug}/dish/${dish.slug}`;
      const qrCode = await getQrCodeDataUrl(url);

      return (
        <Card key={dish.id} className="grid gap-4 p-5 md:grid-cols-[120px_1fr_200px] md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
            {dish.imageUrl ? <Image src={dish.imageUrl} alt={dish.name} fill className="object-cover" /> : null}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-stone-950">{dish.name}</h3>
              <Badge className={dish.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                {dish.isAvailable ? "Disponível" : "Indisponível"}
              </Badge>
              {dish.isFeatured ? <Badge className="bg-amber-100 text-amber-700">Promocional</Badge> : null}
            </div>
            <p className="mt-2 text-sm text-stone-500">{dish.category.name} • {formatCurrency(Number(dish.price))}</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">{dish.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline"><a href={`/admin/dishes?edit=${dish.id}`}>Editar</a></Button>
              <Button asChild variant="outline"><a href={url} target="_blank" rel="noreferrer">Abrir página</a></Button>
              <form action={deleteDishAction.bind(null, dish.id)}>
                <Button variant="danger">Excluir</Button>
              </form>
            </div>
          </div>
          <div className="rounded-3xl bg-stone-50 p-4 text-center">
            <Image src={qrCode} alt={`QR do prato ${dish.name}`} width={160} height={160} className="mx-auto rounded-2xl" />
            <a href={qrCode} download={`qr-${dish.slug}.png`} className="mt-3 inline-block text-sm font-semibold text-[var(--primary)]">Baixar QR</a>
          </div>
        </Card>
      );
    })
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Pratos" description="Cadastre pratos com URL própria, vídeo opcional, status e QR individual." />
      <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
        <DishForm
          categories={data.categories.map((category) => ({ id: category.id, name: category.name }))}
          defaultValues={editing ? {
            id: editing.id,
            name: editing.name,
            slug: editing.slug,
            description: editing.description,
            price: Number(editing.price),
            imageUrl: editing.imageUrl ?? "",
            youtubeUrl: editing.youtubeUrl ?? "",
            categoryId: editing.categoryId,
            isAvailable: editing.isAvailable,
            isFeatured: editing.isFeatured,
            sortOrder: editing.sortOrder
          } : undefined}
        />
        <div className="grid gap-4">{dishCards}</div>
      </div>
    </div>
  );
}

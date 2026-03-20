import Image from "next/image";
import Link from "next/link";
import { deleteDishAction } from "@/actions/admin";
import { DishForm } from "@/components/admin/dish-form";
import { SectionHeader } from "@/components/admin/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminDashboardData, getQrCodeDataUrl } from "@/lib/data";
import { buildMenuUrl, formatCurrency } from "@/lib/utils";

export default async function AdminDishesPage({
  searchParams,
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
      const publicPath = buildMenuUrl({
        restaurantSlug: data.restaurant?.slug ?? "",
        dishSlug: dish.slug,
      });
      const url = `${baseUrl}${publicPath}`;
      const qrCode = await getQrCodeDataUrl(url);

      return (
        <Card
          key={dish.id}
          className="grid gap-4 overflow-hidden p-4 sm:p-5 xl:grid-cols-[112px_minmax(0,1fr)_176px] xl:items-center"
        >
          <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-start xl:contents">
            <div className="relative aspect-square w-full max-w-24 overflow-hidden rounded-2xl bg-stone-100 sm:max-w-none xl:w-28">
              {dish.imageUrl ? (
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 112px, 96px"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-stone-950">{dish.name}</h3>
                <Badge
                  className={
                    dish.isAvailable
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {dish.isAvailable ? "Disponível" : "Indisponível"}
                </Badge>
                {dish.isFeatured ? (
                  <Badge className="bg-amber-100 text-amber-700">Promocional</Badge>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-stone-500">
                {dish.category.name} • {formatCurrency(Number(dish.price))}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {dish.description}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href={`/admin/dishes?edit=${dish.id}`}>Editar</Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={url} target="_blank" rel="noreferrer">
                    Abrir página
                  </a>
                </Button>
                <form action={deleteDishAction.bind(null, dish.id)} className="w-full sm:w-auto">
                  <Button variant="danger" className="w-full sm:w-auto">
                    Excluir
                  </Button>
                </form>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-stone-50 p-4 text-center xl:justify-self-end">
            <Image
              src={qrCode}
              alt={`QR do prato ${dish.name}`}
              width={160}
              height={160}
              className="mx-auto rounded-2xl"
            />
            <a
              href={qrCode}
              download={`qr-${dish.slug}.png`}
              className="mt-3 inline-block text-sm font-semibold text-(--primary)"
            >
              Baixar QR
            </a>
          </div>
        </Card>
      );
    }),
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pratos"
        description="Cadastre pratos de forma rápida no mobile e acompanhe a listagem completa com QR individual."
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] 2xl:items-start">
        <div className="2xl:sticky 2xl:top-6">
          <DishForm
            categories={data.categories.map((category) => ({
              id: category.id,
              name: category.name,
            }))}
            defaultValues={
              editing
                ? {
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
                    sortOrder: editing.sortOrder,
                  }
                : undefined
            }
          />
        </div>

        <div className="grid gap-4">
          {dishCards.length ? (
            dishCards
          ) : (
            <Card className="p-6 text-sm text-stone-500">
              Nenhum prato cadastrado ainda. Crie o primeiro prato e valide seu
              QR individual.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

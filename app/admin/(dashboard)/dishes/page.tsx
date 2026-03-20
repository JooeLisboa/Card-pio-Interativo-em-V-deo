import Image from "next/image";
import Link from "next/link";
import { deleteDishAction } from "@/actions/admin";
import { DishForm } from "@/components/admin/dish-form";
import { DishQrDialog } from "@/components/admin/dish-qr-dialog";
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
        <Card key={dish.id} className="overflow-hidden p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-stone-100 sm:h-28 sm:w-28 sm:flex-none">
              {dish.imageUrl ? (
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 112px, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-stone-100 text-sm font-semibold text-stone-400">
                  Sem foto
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex flex-wrap items-start gap-2">
                  <h3 className="min-w-0 flex-1 text-lg font-bold leading-tight text-stone-950 sm:text-xl">
                    {dish.name}
                  </h3>
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
                    <Badge className="bg-amber-100 text-amber-700">
                      Promocional
                    </Badge>
                  ) : null}
                </div>

                <p className="text-sm font-medium text-stone-500">
                  {dish.category.name} • {formatCurrency(Number(dish.price))}
                </p>

                <p className="line-clamp-3 text-sm leading-6 text-stone-600">
                  {dish.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    asChild
                    variant="outline"
                    className="min-h-11 flex-1 sm:flex-none"
                  >
                    <Link href={`/admin/dishes?edit=${dish.id}`}>Editar</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="min-h-11 flex-1 sm:flex-none"
                  >
                    <a href={url} target="_blank" rel="noreferrer">
                      Abrir página
                    </a>
                  </Button>
                  <DishQrDialog
                    dishName={dish.name}
                    dishSlug={dish.slug}
                    dishUrl={url}
                    qrCode={qrCode}
                  />
                  <form
                    action={async () => {
                      "use server";
                      await deleteDishAction(dish.id);
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    <Button variant="danger" className="min-h-11 w-full">
                      Excluir
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Card>
      );
    }),
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pratos"
        description="Cadastre pratos de forma rápida no mobile e acompanhe a listagem completa com QR individual sob demanda."
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
              QR individual quando precisar compartilhar o link público.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

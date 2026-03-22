import Image from "next/image";
import Link from "next/link";
import { CircleOff, ExternalLink, PencilLine, Sparkles, Trash2 } from "lucide-react";
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
      const publicPath = buildMenuUrl({
        restaurantSlug: data.restaurant?.slug ?? "",
        dishSlug: dish.slug
      });
      const url = `${baseUrl}${publicPath}`;
      const qrCode = await getQrCodeDataUrl(url);

      return (
        <Card key={dish.id} className="overflow-hidden p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start">
            <div className="relative overflow-hidden rounded-[28px] bg-stone-100 shadow-sm aspect-[4/3] sm:aspect-square">
              {dish.imageUrl ? (
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 140px, 100vw"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-100 to-stone-200 px-4 text-center text-stone-500">
                  <Sparkles className="h-5 w-5 text-stone-400" />
                  <span className="text-sm font-semibold">Sem foto do prato</span>
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-tight text-stone-950 sm:text-2xl">
                    {dish.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={dish.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                      {dish.isAvailable ? "Disponível" : "Indisponível"}
                    </Badge>
                    {dish.isFeatured ? <Badge className="bg-amber-100 text-amber-700">Promocional</Badge> : null}
                    {!dish.isAvailable ? (
                      <Badge className="bg-stone-100 text-stone-600">
                        <CircleOff className="mr-1 h-3.5 w-3.5" />
                        Ocultar do pedido
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <p className="font-medium text-stone-500">{dish.category.name}</p>
                  <div className="inline-flex w-fit rounded-full bg-stone-950 px-4 py-2 text-sm font-bold text-white">
                    {formatCurrency(Number(dish.price))}
                  </div>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-stone-600">{dish.description}</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Button asChild variant="outline" className="min-h-11 w-full justify-center gap-2">
                  <Link href={`/admin/dishes?edit=${dish.id}`}>
                    <PencilLine className="h-4 w-4" />
                    Editar
                  </Link>
                </Button>
                <Button asChild variant="outline" className="min-h-11 w-full justify-center gap-2">
                  <a href={url} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Abrir página
                  </a>
                </Button>
                <DishQrDialog dishName={dish.name} dishSlug={dish.slug} dishUrl={url} qrCode={qrCode} />
                <form
                  action={async () => {
                    "use server";
                    await deleteDishAction(dish.id);
                  }}
                >
                  <Button variant="danger" className="min-h-11 w-full justify-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Card>
      );
    })
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pratos"
        description="Organize a vitrine do cardápio com mídia, vídeo e status claros em um fluxo realmente pensado para mobile e pronto para escalar no desktop."
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,430px)_minmax(0,1fr)] 2xl:items-start">
        <div className="order-1 2xl:sticky 2xl:top-6">
          <DishForm
            categories={data.categories.map((category) => ({
              id: category.id,
              name: category.name
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
                    sortOrder: editing.sortOrder
                  }
                : undefined
            }
          />
        </div>

        <div className="order-2 grid gap-4">
          {dishCards.length ? (
            <>
              <div className="flex flex-col gap-2 rounded-[28px] border border-[var(--border)] bg-white/80 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Vitrine do admin</p>
                  <h3 className="mt-1 text-lg font-bold text-stone-950">{dishCards.length} prato(s) prontos para gestão</h3>
                </div>
                <p className="text-sm leading-6 text-stone-500">
                  Cards com título priorizado, badges auxiliares e ações em grid para evitar quebras ruins no mobile.
                </p>
              </div>
              {dishCards}
            </>
          ) : (
            <Card className="p-6 text-sm leading-6 text-stone-500">
              Nenhum prato cadastrado ainda. Use o formulário acima para criar o primeiro item, subir a foto e validar o QR individual quando quiser divulgar a página pública.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

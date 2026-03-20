import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CircleOff, MessageCircleMore, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { YoutubeEmbed } from "@/components/public/youtube-embed";
import { buildWhatsAppUrl, extractYoutubeVideoId, formatCurrency } from "@/lib/utils";
import { getDishBySlug, incrementDishView } from "@/lib/data";

export default async function DishPage({
  params,
  searchParams
}: {
  params: Promise<{ restaurantSlug: string; dishSlug: string }>;
  searchParams: Promise<{ table?: string }>;
}) {
  const { restaurantSlug, dishSlug } = await params;
  const { table } = await searchParams;
  const dish = await getDishBySlug({ restaurantSlug, dishSlug });

  if (!dish) {
    notFound();
  }

  await incrementDishView(dish.id, table);

  const tableLabel = table ? `Mesa ${table}` : null;
  const videoId = extractYoutubeVideoId(dish.youtubeUrl);
  const whatsappUrl = buildWhatsAppUrl({
    phone: dish.restaurant.whatsappNumber,
    dishName: dish.name,
    tableLabel
  });

  return (
    <main className="container-shell py-6 sm:py-8" style={{ ["--primary" as string]: dish.restaurant.primaryColor, ["--secondary" as string]: dish.restaurant.secondaryColor } as CSSProperties}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button asChild variant="ghost">
          <Link href={`/menu/${dish.restaurant.slug}${table ? `?table=${table}` : ""}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao cardápio
          </Link>
        </Button>
        {tableLabel ? <Badge className="bg-emerald-100 text-emerald-800">{tableLabel}</Badge> : null}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="relative aspect-[4/3] bg-stone-100">
            {dish.imageUrl ? <Image src={dish.imageUrl} alt={dish.name} fill className="object-cover" /> : null}
          </div>
          <div className="space-y-5 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-stone-100 text-stone-700">{dish.category.name}</Badge>
              {!dish.isAvailable ? (
                <Badge className="bg-red-100 text-red-700">
                  <CircleOff className="mr-1 h-3.5 w-3.5" />
                  Indisponível no momento
                </Badge>
              ) : null}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">{dish.name}</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">{dish.description}</p>
              </div>
              <div className="rounded-3xl bg-stone-950 px-5 py-4 text-2xl font-black text-white">
                {formatCurrency(Number(dish.price))}
              </div>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              {dish.isAvailable ? (
                <Button asChild className="min-h-12 min-w-52">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <MessageCircleMore className="h-4 w-4" />
                    Pedir no WhatsApp
                  </a>
                </Button>
              ) : (
                <Button className="min-h-12 min-w-52" disabled>
                  <MessageCircleMore className="mr-2 h-4 w-4" />
                  Indisponível no momento
                </Button>
              )}
              <Button asChild variant="outline" className="min-h-12 min-w-52">
                <Link href={`/menu/${dish.restaurant.slug}${table ? `?table=${table}` : ""}`} className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Ver mais pratos
                </Link>
              </Button>
            </div>
          </div>
        </Card>
        <div className="grid gap-6">
          {videoId ? (
            <YoutubeEmbed videoId={videoId} />
          ) : (
            <Card className="p-6">
              <p className="text-sm font-semibold text-[var(--primary)]">Conteúdo opcional</p>
              <h2 className="mt-2 text-2xl font-black">Este prato vende bem mesmo sem vídeo.</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                O cliente já encontra nome, descrição, preço, categoria, disponibilidade e CTA de pedido em destaque. Adicione um vídeo depois para enriquecer ainda mais a experiência.
              </p>
            </Card>
          )}
          <Card className="p-6">
            <p className="text-sm font-semibold text-[var(--primary)]">Por que este prato converte?</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
              <li>• Informações essenciais aparecem antes do vídeo.</li>
              <li>• CTA direto para WhatsApp sem carrinho complexo.</li>
              <li>• Página otimizada para QR individual do prato.</li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, CircleOff, MessageCircleMore, Sparkles, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/public/view-tracker";
import { YoutubeEmbed } from "@/components/public/youtube-embed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { getDishBySlug, resolveTableContext } from "@/lib/data";
import { buildMenuUrl, buildWhatsAppUrl, extractYoutubeVideoId, formatCurrency } from "@/lib/utils";

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

  const tableContext = await resolveTableContext({
    restaurantId: dish.restaurantId,
    tableParam: table
  });

  const canonicalTableParam = tableContext?.code ?? null;
  const tableLabel = tableContext ? `Mesa ${tableContext.number}` : null;
  const videoId = extractYoutubeVideoId(dish.youtubeUrl);
  const whatsappUrl = buildWhatsAppUrl({
    phone: dish.restaurant.whatsappNumber,
    dishName: dish.name,
    tableLabel
  });

  return (
    <main
      className="container-shell py-4 sm:py-6"
      style={{
        ["--primary" as string]: dish.restaurant.primaryColor,
        ["--secondary" as string]: dish.restaurant.secondaryColor
      } as CSSProperties}
    >
      <ViewTracker
        dishId={dish.id}
        tableId={tableContext?.id}
        storageKey={`${dish.id}:${canonicalTableParam ?? "public"}`}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" className="min-h-11 px-0 sm:px-4">
          <Link href={buildMenuUrl({ restaurantSlug: dish.restaurant.slug, table: canonicalTableParam })} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao cardápio
          </Link>
        </Button>
        {tableLabel ? <Badge className="bg-emerald-100 text-emerald-800">{tableLabel}</Badge> : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-start">
        <section className="space-y-4">
          {videoId ? (
            <YoutubeEmbed videoId={videoId} fallbackImageUrl={dish.imageUrl} dishName={dish.name} />
          ) : dish.imageUrl ? (
            <div className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-[0_24px_80px_-40px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-4 text-sm font-semibold text-stone-700">
                <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                Destaque do prato
              </div>
              <MediaImage
                src={dish.imageUrl}
                alt={dish.name}
                wrapperClassName="aspect-[4/5] w-full sm:aspect-[16/10]"
                sizes="(max-width: 1280px) 100vw, 60vw"
                fallbackTitle="Não foi possível carregar a foto"
                fallbackDescription="A oferta continua pronta para pedido com preço, descrição e CTA logo abaixo."
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-gradient-to-br from-stone-950 via-stone-900 to-[var(--primary)] p-6 text-white shadow-[0_24px_80px_-40px_rgba(0,0,0,0.55)]">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-3">
                  <Sparkles className="h-5 w-5 text-[var(--secondary)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Apresentação do prato</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight">Experiência visual em preparação</h2>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">
                Este prato ainda não tem vídeo ou foto cadastrados, mas já está pronto para pedido com descrição, preço e CTA de compra.
              </p>
            </div>
          )}

          <Card className="overflow-hidden p-5 sm:p-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-stone-100 text-stone-700">{dish.category.name}</Badge>
                  {dish.isAvailable ? <Badge className="bg-emerald-100 text-emerald-700">Disponível agora</Badge> : null}
                  {dish.isFeatured ? <Badge className="bg-amber-100 text-amber-700">Promoção</Badge> : null}
                  {!dish.isAvailable ? (
                    <Badge className="bg-red-100 text-red-700">
                      <CircleOff className="mr-1 h-3.5 w-3.5" />
                      Indisponível no momento
                    </Badge>
                  ) : null}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Oferta em destaque</p>
                    <h1 className="text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">{dish.name}</h1>
                  </div>
                  <div className="inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-2xl font-black text-white shadow-lg">
                    {formatCurrency(Number(dish.price))}
                  </div>
                </div>

                <p className="max-w-3xl text-base leading-7 text-stone-600 sm:text-lg">{dish.description}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {dish.isAvailable ? (
                  <Button asChild className="min-h-12 w-full justify-center gap-2">
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                      <MessageCircleMore className="h-4 w-4" />
                      Pedir no WhatsApp
                    </a>
                  </Button>
                ) : (
                  <Button className="min-h-12 w-full" disabled>
                    <MessageCircleMore className="mr-2 h-4 w-4" />
                    Indisponível no momento
                  </Button>
                )}

                <Button asChild variant="outline" className="min-h-12 w-full justify-center gap-2">
                  <Link href={buildMenuUrl({ restaurantSlug: dish.restaurant.slug, table: canonicalTableParam })} className="flex items-center justify-center gap-2">
                    <Tag className="h-4 w-4" />
                    Ver mais pratos
                  </Link>
                </Button>
              </div>

              <div className="rounded-[28px] border border-[var(--border)] bg-stone-50/80 px-4 py-4 text-sm leading-6 text-stone-600">
                <span className="font-semibold text-stone-900">Dica de conversão:</span> este prato já está estruturado para QR individual, mídia em destaque e pedido rápido pelo WhatsApp.
              </div>
            </div>
          </Card>
        </section>

        <aside className="grid gap-4 xl:sticky xl:top-6">
          <Card className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Mais desejo de compra</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950">Uma landing page feita para vender o prato.</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
              <li>• Mídia destacada acima da dobra para chamar atenção no celular.</li>
              <li>• Preço e CTA visíveis logo após o conteúdo principal.</li>
              <li>• Status de disponibilidade e promoção com leitura instantânea.</li>
            </ul>
          </Card>

          <Card className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Pronto para QR individual</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
              <li>• Link direto para WhatsApp com mensagem pronta e referência da mesa.</li>
              <li>• Visualização contabilizada uma única vez por sessão do navegador.</li>
              <li>• Página otimizada para mostrar vídeo, foto e oferta sem ruído visual.</li>
            </ul>
          </Card>
        </aside>
      </div>
    </main>
  );
}

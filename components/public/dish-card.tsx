import Link from "next/link";
import { ArrowRight, CircleOff, Flame, PlayCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { buildMenuUrl, extractYoutubeVideoId, formatCurrency } from "@/lib/utils";

type DishCardProps = {
  restaurantSlug: string;
  tableCode?: string | null;
  dish: {
    slug: string;
    name: string;
    description: string;
    price: unknown;
    imageUrl?: string | null;
    isAvailable: boolean;
    isFeatured: boolean;
    youtubeUrl?: string | null;
  };
};

export function DishCard({ restaurantSlug, tableCode, dish }: DishCardProps) {
  const href = buildMenuUrl({
    restaurantSlug,
    dishSlug: dish.slug,
    table: tableCode
  });
  const hasVideo = Boolean(extractYoutubeVideoId(dish.youtubeUrl));

  return (
    <article className="surface overflow-hidden">
      <div className="relative">
        <MediaImage
          src={dish.imageUrl}
          alt={dish.name}
          wrapperClassName="aspect-[4/3]"
          sizes="(max-width: 768px) 100vw, 50vw"
          fallbackTitle="Foto do prato em breve"
          fallbackDescription="A experiência continua pronta para pedido com vídeo, preço e descrição em destaque."
        />

        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-4">
          {dish.isFeatured ? (
            <Badge className="bg-amber-300 text-stone-950">
              <Flame className="mr-1 h-3.5 w-3.5" />
              Promoção
            </Badge>
          ) : null}
          {hasVideo ? (
            <Badge className="bg-white/92 text-stone-900">
              <PlayCircle className="mr-1 h-3.5 w-3.5" />
              Vídeo do prato
            </Badge>
          ) : null}
          {!dish.isAvailable ? (
            <Badge className="bg-red-100 text-red-700">
              <CircleOff className="mr-1 h-3.5 w-3.5" />
              Indisponível
            </Badge>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent px-4 pb-4 pt-10 text-white">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">Vitrine digital</p>
              <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-tight sm:text-2xl">{dish.name}</h3>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/96 px-3 py-2 text-sm font-black text-stone-950 shadow-lg sm:px-4">
              {formatCurrency(Number(dish.price))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2 text-xs">
          {dish.isAvailable ? <Badge className="bg-emerald-100 text-emerald-700">Disponível agora</Badge> : null}
          {hasVideo ? <Badge className="bg-stone-100 text-stone-700">Assistir antes de pedir</Badge> : null}
          {!hasVideo && !dish.imageUrl ? (
            <Badge className="bg-stone-100 text-stone-700">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Oferta pronta para divulgação
            </Badge>
          ) : null}
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-stone-600">{dish.description}</p>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-xs leading-5 text-stone-500">{hasVideo ? "Abra para assistir e pedir em seguida." : "Abra para ver a oferta completa e pedir rápido."}</p>
          <Button asChild className="min-h-12 w-full justify-between sm:w-auto sm:min-w-48">
            <Link href={href} prefetch={false}>
              Ver prato
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleOff, Flame, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <div className="relative aspect-[4/3] bg-stone-100">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 px-4 text-center text-sm font-medium text-stone-500">
            Foto em breve
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />
        <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
          {dish.isFeatured ? (
            <Badge className="bg-amber-300 text-stone-950">
              <Flame className="mr-1 h-3.5 w-3.5" />
              Promoção
            </Badge>
          ) : null}
          {hasVideo ? (
            <Badge className="bg-white/90 text-stone-900">
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
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Experiência visual</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-tight">{dish.name}</h3>
            <div className="shrink-0 rounded-2xl bg-white/95 px-3 py-2 text-sm font-bold text-stone-950 shadow-sm">
              {formatCurrency(Number(dish.price))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <p className="line-clamp-3 text-sm leading-6 text-stone-600">{dish.description}</p>
        <Button asChild className="min-h-12 w-full justify-between">
          <Link href={href} prefetch={false}>
            Ver vídeo e detalhes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

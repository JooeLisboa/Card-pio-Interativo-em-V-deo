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
          <Image src={dish.imageUrl} alt={dish.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">Sem imagem</div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {dish.isFeatured ? (
            <Badge className="bg-amber-400 text-stone-950">
              <Flame className="mr-1 h-3.5 w-3.5" />
              Promoção
            </Badge>
          ) : null}
          {hasVideo ? (
            <Badge className="bg-white/90 text-stone-900">
              <PlayCircle className="mr-1 h-3.5 w-3.5" />
              Vídeo
            </Badge>
          ) : null}
          {!dish.isAvailable ? (
            <Badge className="bg-red-100 text-red-700">
              <CircleOff className="mr-1 h-3.5 w-3.5" />
              Indisponível
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-950">{dish.name}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">{dish.description}</p>
          </div>
          <div className="shrink-0 rounded-2xl bg-stone-950 px-3 py-2 text-sm font-bold text-white">
            {formatCurrency(Number(dish.price))}
          </div>
        </div>
        <Button asChild className="min-h-12 w-full justify-between">
          <Link href={href} prefetch={false}>
            Ver detalhes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

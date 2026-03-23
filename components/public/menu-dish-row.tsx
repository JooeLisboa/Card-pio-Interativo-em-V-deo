import Link from "next/link";
import { CircleOff, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buildMenuUrl, extractYoutubeVideoId, formatCurrency } from "@/lib/utils";

type MenuDishRowProps = {
  restaurantSlug: string;
  tableCode?: string | null;
  dish: {
    slug: string;
    name: string;
    description: string;
    price: unknown;
    isAvailable: boolean;
    youtubeUrl?: string | null;
  };
};

export function MenuDishRow({ restaurantSlug, tableCode, dish }: MenuDishRowProps) {
  const hasVideo = Boolean(extractYoutubeVideoId(dish.youtubeUrl));
  const href = buildMenuUrl({ restaurantSlug, dishSlug: dish.slug, table: tableCode });

  return (
    <article className="group border-b border-stone-200/80 py-4 last:border-b-0 sm:py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href={href}
            prefetch={false}
            className="inline-flex max-w-full items-center gap-2 text-left text-lg font-black tracking-tight text-stone-950 transition group-hover:text-[var(--primary)] sm:text-xl"
          >
            <span className="truncate">{dish.name}</span>
            {hasVideo ? <PlayCircle className="h-4 w-4 shrink-0 text-[var(--primary)]" /> : null}
          </Link>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500 sm:text-[15px]">{dish.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {hasVideo ? <Badge className="bg-amber-100 text-amber-800">Vídeo e detalhes</Badge> : null}
            <Badge className="bg-stone-100 text-stone-700">Ver página do prato</Badge>
            {!dish.isAvailable ? (
              <Badge className="bg-red-100 text-red-700">
                <CircleOff className="mr-1 h-3.5 w-3.5" />
                Indisponível no momento
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 rounded-full border border-stone-200 bg-stone-950 px-4 py-2 text-sm font-black text-white shadow-sm sm:text-base">
          {formatCurrency(Number(dish.price))}
        </div>
      </div>
    </article>
  );
}

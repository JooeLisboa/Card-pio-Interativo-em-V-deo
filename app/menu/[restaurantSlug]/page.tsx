import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { MenuCategoryNav } from "@/components/public/menu-category-nav";
import { MenuDishRow } from "@/components/public/menu-dish-row";
import { MenuHeader } from "@/components/public/menu-header";
import { Input } from "@/components/ui/input";
import { getMenuByRestaurantSlug, resolveTableContext } from "@/lib/data";
import { buildMenuUrl } from "@/lib/utils";

export default async function MenuPage({
  params,
  searchParams
}: {
  params: Promise<{ restaurantSlug: string }>;
  searchParams: Promise<{ table?: string; q?: string }>;
}) {
  const { restaurantSlug } = await params;
  const { table, q } = await searchParams;
  const restaurant = await getMenuByRestaurantSlug(restaurantSlug);

  if (!restaurant) {
    notFound();
  }

  const tableContext = await resolveTableContext({
    restaurantId: restaurant.id,
    tableParam: table
  });

  const query = q?.toLowerCase().trim();
  const categories = restaurant.categories
    .map((category) => ({
      ...category,
      dishes: category.dishes.filter(
        (dish) =>
          !query ||
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query) ||
          category.name.toLowerCase().includes(query)
      )
    }))
    .filter((category) => category.dishes.length > 0);

  const canonicalTableParam = tableContext?.code ?? null;
  const clearFilterHref = buildMenuUrl({
    restaurantSlug: restaurant.slug,
    table: canonicalTableParam
  });

  return (
    <main
      className="container-shell py-4 sm:py-6 lg:py-8"
      style={{
        ["--primary" as string]: restaurant.primaryColor,
        ["--secondary" as string]: restaurant.secondaryColor
      } as CSSProperties}
    >
      <MenuHeader
        name={restaurant.name}
        description={restaurant.description}
        logoUrl={restaurant.logoUrl}
        phoneNumber={restaurant.phoneNumber}
        whatsappNumber={restaurant.whatsappNumber}
        serviceLabel={restaurant.serviceLabel}
        totalCategories={restaurant.categories.length}
        totalDishes={restaurant.categories.reduce((acc, category) => acc + category.dishes.length, 0)}
        tableLabel={tableContext ? `Mesa ${tableContext.number}` : undefined}
      />

      <section className="mt-4 surface border-stone-200/70 bg-white/95 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <form className="relative" action={buildMenuUrl({ restaurantSlug: restaurant.slug })}>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Buscar prato, ingrediente ou categoria"
              className="min-h-12 border-stone-200 pl-10"
            />
            {canonicalTableParam ? <input type="hidden" name="table" value={canonicalTableParam} /> : null}
          </form>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-600">
            Toque no nome do prato para ver detalhes, vídeo e pedido.
          </div>
        </div>
      </section>

      {categories.length ? (
        <section className="mt-4 surface border-stone-200/70 bg-white/95 p-4 sm:p-5">
          <MenuCategoryNav
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
              dishesCount: category.dishes.length
            }))}
          />
        </section>
      ) : null}

      <section id="categorias" className="mt-6 space-y-6 sm:space-y-8">
        {categories.length ? (
          categories.map((category) => (
            <section
              key={category.id}
              id={`categoria-${category.slug}`}
              className="surface border-stone-200/70 bg-[linear-gradient(180deg,rgba(255,247,237,0.72),rgba(255,255,255,0.98))] p-5 sm:p-6 lg:p-7"
            >
              <div className="border-b border-stone-200/80 pb-4 sm:pb-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary)]">Categoria</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950 sm:text-3xl">{category.name}</h2>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-stone-500">{category.dishes.length} itens</span>
                </div>
              </div>

              <div className="mt-1">
                {category.dishes.map((dish) => (
                  <MenuDishRow
                    key={dish.id}
                    restaurantSlug={restaurant.slug}
                    tableCode={canonicalTableParam}
                    dish={dish}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="surface border-stone-200/70 bg-white/95 p-8 text-center">
            <p className="text-base font-semibold text-stone-900">Nenhum prato encontrado.</p>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Ajuste a busca ou limpe o filtro para voltar ao cardápio completo.
            </p>
            <Link href={clearFilterHref} className="mt-4 inline-flex text-sm font-semibold text-[var(--primary)]">
              Limpar filtro
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

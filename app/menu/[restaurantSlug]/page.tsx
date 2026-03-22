import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { DishCard } from "@/components/public/dish-card";
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
          dish.description.toLowerCase().includes(query)
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
      className="container-shell py-4 sm:py-6"
      style={{
        ["--primary" as string]: restaurant.primaryColor,
        ["--secondary" as string]: restaurant.secondaryColor
      } as CSSProperties}
    >
      <MenuHeader
        name={restaurant.name}
        description={restaurant.description}
        logoUrl={restaurant.logoUrl}
        totalCategories={restaurant.categories.length}
        totalDishes={restaurant.categories.reduce((acc, category) => acc + category.dishes.length, 0)}
        tableLabel={tableContext ? `Mesa ${tableContext.number}` : undefined}
      />

      <section className="mt-4 surface p-4 sm:p-5">
        <form className="relative" action={buildMenuUrl({ restaurantSlug: restaurant.slug })}>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Buscar prato, ingrediente ou categoria"
            className="min-h-12 pl-10"
          />
          {canonicalTableParam ? <input type="hidden" name="table" value={canonicalTableParam} /> : null}
        </form>
      </section>

      <section id="categorias" className="mt-6 space-y-8">
        {categories.length ? (
          categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Categoria</p>
                  <h2 className="text-2xl font-black tracking-tight text-stone-950">{category.name}</h2>
                </div>
                <span className="shrink-0 text-sm text-stone-500">{category.dishes.length} itens</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {category.dishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    restaurantSlug={restaurant.slug}
                    tableCode={canonicalTableParam}
                    dish={dish}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="surface p-8 text-center">
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

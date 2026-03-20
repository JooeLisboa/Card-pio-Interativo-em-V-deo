import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { DishCard } from "@/components/public/dish-card";
import { MenuHeader } from "@/components/public/menu-header";
import { Input } from "@/components/ui/input";
import { getMenuByRestaurantSlug } from "@/lib/data";

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

  const query = q?.toLowerCase().trim();
  const categories = restaurant.categories
    .map((category) => ({
      ...category,
      dishes: category.dishes.filter((dish) => !query || dish.name.toLowerCase().includes(query) || dish.description.toLowerCase().includes(query))
    }))
    .filter((category) => category.dishes.length > 0);

  return (
    <main className="container-shell py-6 sm:py-8" style={{ ["--primary" as string]: restaurant.primaryColor, ["--secondary" as string]: restaurant.secondaryColor } as CSSProperties}>
      <MenuHeader
        name={restaurant.name}
        description={restaurant.description}
        logoUrl={restaurant.logoUrl}
        totalCategories={restaurant.categories.length}
        tableLabel={table ? `Mesa ${table}` : undefined}
      />
      <section className="mt-6 surface p-4 sm:p-5">
        <form className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input name="q" defaultValue={q} placeholder="Buscar prato" className="pl-10" />
          {table ? <input type="hidden" name="table" value={table} /> : null}
        </form>
      </section>
      <section id="categorias" className="mt-6 space-y-8">
        {categories.length ? categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Categoria</p>
                <h2 className="text-2xl font-black tracking-tight text-stone-950">{category.name}</h2>
              </div>
              <span className="text-sm text-stone-500">{category.dishes.length} itens</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {category.dishes.map((dish) => (
                <DishCard key={dish.id} restaurantSlug={restaurant.slug} tableCode={table} dish={dish} />
              ))}
            </div>
          </div>
        )) : (
          <div className="surface p-8 text-center text-sm text-stone-500">
            Nenhum prato encontrado para sua busca. <Link href={`/menu/${restaurant.slug}${table ? `?table=${table}` : ""}`} className="font-semibold text-[var(--primary)]">Limpar filtro</Link>
          </div>
        )}
      </section>
    </main>
  );
}

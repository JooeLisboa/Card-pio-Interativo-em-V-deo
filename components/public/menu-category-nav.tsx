import { cn } from "@/lib/utils";

type MenuCategoryNavProps = {
  categories: Array<{ id: string; name: string; slug: string; dishesCount: number }>;
  activeCategoryId?: string;
};

export function MenuCategoryNav({ categories, activeCategoryId }: MenuCategoryNavProps) {
  return (
    <nav aria-label="Categorias do cardápio" className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2.5">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#categoria-${category.slug}`}
            className={cn(
              "rounded-full border px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition",
              activeCategoryId === category.id
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-700 hover:border-[var(--primary)] hover:text-[var(--primary)]"
            )}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-75">{category.dishesCount}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

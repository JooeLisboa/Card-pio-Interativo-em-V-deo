import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function MenuHeader({
  name,
  description,
  logoUrl,
  totalCategories,
  totalDishes,
  tableLabel
}: {
  name: string;
  description: string;
  logoUrl?: string | null;
  totalCategories: number;
  totalDishes: number;
  tableLabel?: string | null;
}) {
  return (
    <div className="surface overflow-hidden p-5 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          {logoUrl ? (
            <Image src={logoUrl} alt={name} width={72} height={72} className="h-[72px] w-[72px] rounded-2xl object-cover" />
          ) : (
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-2xl font-bold text-white">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <Badge className="bg-amber-100 text-amber-800">Experiência premium</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">{name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">{description}</p>
          </div>
        </div>
        <div className="grid gap-2 rounded-3xl bg-stone-50 p-4 text-sm text-stone-600">
          <span>{totalCategories} categorias ativas</span>
          <span>{totalDishes} pratos publicados</span>
          {tableLabel ? <Badge className="bg-emerald-100 text-emerald-800">{tableLabel}</Badge> : null}
          <Link href="#categorias" className="font-semibold text-[var(--primary)]">
            Explorar cardápio
          </Link>
        </div>
      </div>
    </div>
  );
}

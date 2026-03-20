import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function MenuHeader({
  name,
  description,
  logoUrl,
  totalCategories,
  tableLabel
}: {
  name: string;
  description: string;
  logoUrl?: string | null;
  totalCategories: number;
  tableLabel?: string | null;
}) {
  return (
    <div className="surface overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <Image src={logoUrl} alt={name} width={72} height={72} className="h-18 w-18 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-stone-900 text-2xl font-bold text-white">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <Badge className="bg-amber-100 text-amber-800">Experiência premium</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">{name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">{description}</p>
          </div>
        </div>
        <div className="grid gap-2 text-sm text-stone-600">
          <span>{totalCategories} categorias ativas</span>
          {tableLabel ? <Badge className="bg-emerald-100 text-emerald-800">{tableLabel}</Badge> : null}
          <Link href="#categorias" className="font-semibold text-[var(--primary)]">
            Explorar cardápio
          </Link>
        </div>
      </div>
    </div>
  );
}

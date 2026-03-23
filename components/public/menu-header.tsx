import Image from "next/image";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPhoneDisplay } from "@/lib/utils";

export function MenuHeader({
  name,
  description,
  logoUrl,
  phoneNumber,
  whatsappNumber,
  serviceLabel,
  totalCategories,
  totalDishes,
  tableLabel
}: {
  name: string;
  description: string;
  logoUrl?: string | null;
  phoneNumber?: string | null;
  whatsappNumber: string;
  serviceLabel?: string | null;
  totalCategories: number;
  totalDishes: number;
  tableLabel?: string | null;
}) {
  return (
    <header className="surface overflow-hidden border-stone-200/70 bg-[linear-gradient(180deg,rgba(255,247,237,0.96),rgba(255,255,255,0.98))] p-5 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4 sm:gap-5">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={name}
              width={88}
              height={88}
              className="h-[72px] w-[72px] rounded-[24px] border border-stone-200 object-cover shadow-sm sm:h-[88px] sm:w-[88px]"
            />
          ) : (
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[24px] bg-stone-900 text-2xl font-bold text-white sm:h-[88px] sm:w-[88px]">
              {name.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <Badge className="bg-amber-100 text-amber-800">Cardápio digital do restaurante</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">{name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">{description}</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[24px] border border-stone-200/80 bg-white px-4 py-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">Telefone</p>
              <p className="mt-2 text-sm font-bold text-stone-900 sm:text-base">{formatPhoneDisplay(phoneNumber || whatsappNumber)}</p>
            </div>
            <div className="rounded-[24px] border border-stone-200/80 bg-white px-4 py-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">WhatsApp</p>
              <p className="mt-2 text-sm font-bold text-stone-900 sm:text-base">{formatPhoneDisplay(whatsappNumber)}</p>
            </div>
            <div className="rounded-[24px] border border-stone-200/80 bg-white px-4 py-4 shadow-sm sm:col-span-2 xl:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">Entrega ou retirada</p>
              <p className="mt-2 text-sm font-medium leading-6 text-stone-700">{serviceLabel || "Consulte disponibilidade para retirada e entrega."}</p>
            </div>
          </div>

          <div className="grid gap-3 rounded-[28px] border border-stone-200/80 bg-stone-950 p-4 text-white shadow-[0_24px_60px_-40px_rgba(0,0,0,0.5)] sm:grid-cols-3 lg:min-w-[320px] lg:grid-cols-1 xl:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">Categorias</p>
              <p className="mt-1 text-lg font-black">{totalCategories}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">Pratos</p>
              <p className="mt-1 text-lg font-black">{totalDishes}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-start xl:justify-end">
              {tableLabel ? <Badge className="bg-emerald-100 text-emerald-800">{tableLabel}</Badge> : null}
              <a href="#categorias" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200">
                <ScrollText className="h-4 w-4" />
                Ver cardápio
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

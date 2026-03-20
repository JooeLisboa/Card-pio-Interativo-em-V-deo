import Link from "next/link";
import { ArrowRight, QrCode, Smartphone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  {
    icon: Video,
    title: "Vídeo por prato",
    description: "Cada item pode ter uma página própria com vídeo incorporado do YouTube sem depender do play para vender."
  },
  {
    icon: QrCode,
    title: "QR individual",
    description: "Divulgação por prato, mesa ou cardápio completo com links internos do sistema."
  },
  {
    icon: Smartphone,
    title: "Mobile-first",
    description: "Experiência premium, leve e pensada para conversão em celulares."
  }
];

export default function HomePage() {
  return (
    <main className="container-shell py-10 sm:py-16">
      <section className="surface overflow-hidden p-8 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Produto demo</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-stone-950 sm:text-6xl">
              Cardápio Interativo em Vídeo para restaurantes que querem vender mais.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              Uma base fullstack profissional com cardápio digital, página própria por prato, QR codes por prato e mesa, painel admin e analytics básico.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="min-w-48">
                <Link href="/menu/sabor-da-casa" className="flex items-center gap-2">
                  Ver cardápio demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="min-w-48">
                <Link href="/admin/login">Acessar admin</Link>
              </Button>
            </div>
          </div>
          <Card className="grid gap-4 bg-stone-950 p-6 text-white">
            <p className="text-sm text-white/70">MVP pronto para Vercel</p>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-3xl font-black">Sabor da Casa</p>
              <p className="mt-2 text-sm text-white/70">Cardápio digital com vídeos dos pratos</p>
              <div className="mt-6 grid gap-3 text-sm">
                <div className="rounded-2xl bg-white/10 px-4 py-3">QR geral do cardápio</div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">QR por mesa</div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">QR por prato</div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-[var(--primary)]">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
            </Card>
          );
        })}
      </section>
    </main>
  );
}

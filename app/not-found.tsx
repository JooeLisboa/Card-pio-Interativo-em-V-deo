import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-10">
      <div className="surface max-w-xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">404</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">Conteúdo não encontrado</h1>
        <p className="mt-4 text-sm leading-6 text-stone-600">A rota solicitada não existe ou o item pode ter sido removido do cardápio.</p>
        <Button asChild className="mt-6">
          <Link href="/">Voltar para a home</Link>
        </Button>
      </div>
    </main>
  );
}

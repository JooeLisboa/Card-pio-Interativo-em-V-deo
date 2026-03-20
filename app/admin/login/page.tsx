import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-8 sm:py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_480px]">
        <section className="surface p-6 sm:p-8 text-stone-950">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Painel administrativo</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Controle o cardápio, QR codes e analytics em um único lugar.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
            Acesse o dashboard para gerenciar categorias, pratos, mesas, configuração do restaurante e acompanhar os pratos mais visualizados.
          </p>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CirclePlay,
  MessageCircleMore,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  UtensilsCrossed,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Video,
    title: "Vídeo por prato para abrir o apetite antes do pedido",
    description:
      "Cada item pode ganhar uma página própria com vídeo, descrição e CTA, elevando a apresentação e o valor percebido do cardápio."
  },
  {
    icon: QrCode,
    title: "Acesso rápido por QR Code na mesa, balcão ou delivery",
    description:
      "O cliente escaneia e cai direto no cardápio online, sem atrito, com experiência pensada para restaurante tradicional e operação real."
  },
  {
    icon: Smartphone,
    title: "Mobile-first de verdade para o cliente escolher com conforto",
    description:
      "Layout leve, leitura clara, botões amplos e navegação fluida para funcionar bem onde a decisão acontece: no celular."
  },
  {
    icon: UtensilsCrossed,
    title: "Categorias organizadas para vender melhor o mix do restaurante",
    description:
      "Entradas, principais, bebidas e sobremesas aparecem com hierarquia de menu, evitando cara de catálogo genérico ou marketplace."
  },
  {
    icon: ShieldCheck,
    title: "Apresentação profissional que transmite confiança",
    description:
      "Visual premium, elegante e fácil de entender para valorizar a casa, os pratos e a experiência do cliente."
  },
  {
    icon: Sparkles,
    title: "Atualização simples para acompanhar o ritmo da operação",
    description:
      "Pratos, categorias, links e informações públicas podem ser ajustados sem transformar a gestão em uma tarefa complexa."
  }
];

const steps = [
  "O cliente escaneia o QR Code do restaurante ou da mesa.",
  "Abre um cardápio online organizado por categorias, com leitura impecável no celular.",
  "Escolhe o prato com mais segurança ao ver detalhes, preço e vídeo quando disponível.",
  "Segue para a página individual do item e finaliza o pedido com muito mais confiança."
];

const differentiators = [
  "Visual premium inspirado em cardápio de restaurante, não em vitrine genérica de app.",
  "Página individual por prato com vídeo, preço, descrição e CTA para pedido rápido.",
  "Estrutura preparada para QR do cardápio, QR por mesa e divulgação individual dos pratos.",
  "Experiência pensada para restaurante tradicional, lanchonete, bistrô e operação de comida caseira."
];

const testimonials = [
  {
    quote:
      "A estrutura transmite profissionalismo e deixa o cardápio muito mais convincente do que uma lista simples no celular.",
    author: "Espaço reservado para depoimento",
    role: "Restaurante parceiro"
  },
  {
    quote:
      "O cliente entende melhor o prato, percebe mais valor e tende a decidir com menos dúvida quando vê uma apresentação mais rica.",
    author: "Espaço reservado para case",
    role: "Operação de delivery ou salão"
  },
  {
    quote:
      "Ideal para negócios que querem modernizar o atendimento sem perder a identidade de restaurante tradicional.",
    author: "Espaço reservado para segmento",
    role: "Lanchonete, casa de comida e restaurante"
  }
];

const faq = [
  {
    question: "Funciona bem no celular?",
    answer:
      "Sim. O produto foi desenhado com foco mobile-first, com leitura confortável, navegação simples e áreas de toque adequadas para telas pequenas."
  },
  {
    question: "Posso atualizar pratos e categorias depois?",
    answer:
      "Sim. A estrutura administrativa permite editar informações públicas do restaurante, categorias e pratos sem mudar a base do projeto."
  },
  {
    question: "O sistema pode ser usado com QR Code?",
    answer:
      "Sim. O fluxo já foi pensado para acesso rápido por QR Code geral do cardápio, mesa ou links individuais de divulgação."
  },
  {
    question: "É possível mostrar vídeo dos pratos?",
    answer:
      "Sim. Cada prato pode ter uma página própria com vídeo incorporado, reforçando apetite, confiança e valor percebido antes do pedido."
  },
  {
    question: "Serve para qualquer restaurante?",
    answer:
      "A proposta funciona especialmente bem para restaurantes tradicionais, hamburguerias, lanchonetes, casas de comida e operações com retirada ou delivery."
  },
  {
    question: "A apresentação pode ser personalizada?",
    answer:
      "Sim. Cores, identidade do restaurante, organização das categorias e conteúdo público já foram pensados para adaptação comercial."
  },
  {
    question: "Como funciona a demonstração?",
    answer:
      "O CTA leva para um fluxo comercial de demonstração. O texto e o destino do botão foram mantidos fáceis de editar para encaixar no processo de vendas."
  }
];

const planHighlights = [
  "Landing comercial + cardápio público premium",
  "Página individual por prato com vídeo e CTA",
  "Experiência mobile-first com QR Code",
  "Estrutura pronta para personalização do restaurante",
  "Conteúdo e oferta fáceis de editar"
];

function DemoLink({ children, secondary = false }: { children: ReactNode; secondary?: boolean }) {
  return (
    <Button asChild variant={secondary ? "outline" : "default"} className="min-h-12 px-6">
      <Link href="/admin/login" className="flex items-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <section className="container-shell py-5 sm:py-8 lg:py-10">
        <div className="surface overflow-hidden border-stone-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,247,237,0.96))] p-5 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
                <Star className="h-3.5 w-3.5" />
                Solução comercial para restaurantes
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-stone-950 sm:text-5xl lg:text-6xl lg:leading-[1.03]">
                Transforme o cardápio do seu restaurante em uma experiência mais elegante, persuasiva e pronta para vender.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
                Um sistema web de cardápio interativo que valoriza os pratos, facilita a escolha do cliente e apresenta o restaurante com uma imagem mais premium — com QR Code, categorias organizadas e vídeos por item.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <DemoLink>Solicitar demonstração</DemoLink>
                <Button asChild variant="outline" className="min-h-12 px-6">
                  <Link href="/menu/sabor-da-casa" className="flex items-center gap-2">
                    Ver exemplo
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Visual premium para restaurante tradicional",
                  "Vídeo por prato para aumentar desejo",
                  "Mobile-first com leitura impecável"
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-stone-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.24),transparent_58%)]" />
              <Card className="relative overflow-hidden border-stone-200/70 bg-stone-950 p-4 text-white sm:p-5">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Preview do produto</p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight">Sabor da Casa</h2>
                    </div>
                    <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                      Cardápio no ar
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 rounded-[26px] bg-white text-stone-900 p-4 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.55)]">
                    <div className="flex items-start justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Cardápio premium</p>
                        <p className="mt-1 text-lg font-black">Pratos organizados por categoria</p>
                      </div>
                      <QrCode className="mt-1 h-5 w-5 text-[var(--primary)]" />
                    </div>

                    {[
                      { name: "Bruschetta da Casa", price: "R$ 24,90", tag: "Vídeo do prato" },
                      { name: "Parmegiana Premium", price: "R$ 54,90", tag: "Detalhes e pedido" },
                      { name: "Brownie com Gelato", price: "R$ 22,90", tag: "Página individual" }
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-stone-900">{item.name}</p>
                          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-stone-500">
                            <CirclePlay className="h-3.5 w-3.5 text-[var(--primary)]" />
                            {item.tag}
                          </p>
                        </div>
                        <div className="rounded-full bg-stone-950 px-3 py-1.5 text-sm font-black text-white">{item.price}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/80">
                      QR do cardápio, mesa e pratos prontos para divulgação.
                    </div>
                    <div className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/80">
                      Layout pensado para vender melhor no salão, retirada e delivery.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-8 sm:py-10 lg:py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Benefícios</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
            Mais valor percebido para o restaurante e mais clareza para o cliente pedir.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="h-full border-stone-200/70 p-5 sm:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-[var(--primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-stone-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-[15px]">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container-shell py-8 sm:py-10 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Card className="border-stone-200/70 bg-stone-950 p-6 text-white sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">Como funciona</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Simples para o cliente. Valioso para o restaurante.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              O fluxo foi pensado para reduzir atrito, destacar os pratos certos e ajudar o cliente a decidir com mais segurança.
            </p>
          </Card>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <Card key={step} className="border-stone-200/70 p-5 sm:p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-950 text-lg font-black text-white">
                    0{index + 1}
                  </div>
                  <p className="pt-1 text-base leading-7 text-stone-700">{step}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-8 sm:py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Diferenciais</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              Uma apresentação muito acima do cardápio comum, sem complicar a operação.
            </h2>
            <div className="mt-6 grid gap-3">
              {differentiators.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-stone-200/70 bg-white/85 px-4 py-4 shadow-sm">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-stone-700 sm:text-[15px]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-stone-200/70 bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Comparativo implícito</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-dashed border-stone-300 bg-stone-50 p-4">
                <p className="text-sm font-bold text-stone-500">Cardápio comum</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-500">
                  <li>• Lista fria de itens</li>
                  <li>• Pouca percepção de valor</li>
                  <li>• Dificuldade para destacar pratos</li>
                </ul>
              </div>
              <div className="rounded-[24px] border border-[var(--primary)]/15 bg-white p-4 shadow-sm">
                <p className="text-sm font-bold text-stone-900">Sua vitrine digital</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                  <li>• Categorias elegantes e organizadas</li>
                  <li>• Vídeo e página individual por prato</li>
                  <li>• Mais confiança para pedir</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="container-shell py-8 sm:py-10 lg:py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Prova social</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
            Estrutura comercial pronta para receber depoimentos, números e credibilidade de mercado.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 xl:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.quote} className="h-full border-stone-200/70 p-6">
              <p className="text-base leading-7 text-stone-700">“{item.quote}”</p>
              <div className="mt-6 border-t border-stone-200 pt-4">
                <p className="font-bold text-stone-950">{item.author}</p>
                <p className="text-sm text-stone-500">{item.role}</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-4 rounded-[28px] border border-dashed border-stone-300 bg-white/70 px-5 py-4 text-sm leading-6 text-stone-500">
          Blocos de depoimentos e resultados acima estão como placeholders elegantes e editáveis para futura substituição por provas sociais reais.
        </div>
      </section>

      <section className="container-shell py-8 sm:py-10 lg:py-14">
        <Card className="overflow-hidden border-stone-200/70 bg-stone-950 p-6 text-white sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">Oferta comercial</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Plano principal para restaurantes que querem vender com mais apresentação.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
                Uma oferta visual pronta para comercialização, com posicionamento premium e fácil ajuste de preço, condições e proposta final.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {planHighlights.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/85">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] bg-white p-5 text-stone-900 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.6)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Plano premium</p>
              <div className="mt-4">
                <p className="text-sm text-stone-500">Valor editável</p>
                <p className="mt-1 text-4xl font-black tracking-tight">R$ 0,00</p>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Placeholder pronto para receber o preço comercial definitivo, taxa de implantação ou assinatura mensal.
                </p>
              </div>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-stone-700">
                {planHighlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <DemoLink>Solicitar demonstração</DemoLink>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="container-shell py-8 sm:py-10 lg:py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
            Perguntas comuns antes de contratar a solução.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {faq.map((item) => (
            <Card key={item.question} className="h-full border-stone-200/70 p-5 sm:p-6">
              <h3 className="text-lg font-black tracking-tight text-stone-950">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20">
        <Card className="border-stone-200/70 bg-[linear-gradient(135deg,rgba(124,63,18,0.96),rgba(28,25,23,0.96))] p-6 text-white sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">Pronto para apresentar melhor e vender mais</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
                Leve para o seu restaurante um cardápio digital com cara de produto premium — e não de demo simples.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
                Estruture uma demonstração comercial, mostre a experiência no celular e use a nova apresentação para converter restaurantes com mais confiança.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <DemoLink>Solicitar demonstração</DemoLink>
              <Button asChild variant="outline" className="min-h-12 border-white/20 bg-transparent px-6 text-white hover:bg-white/10">
                <Link href="/menu/sabor-da-casa" className="flex items-center gap-2">
                  Conhecer funcionamento
                  <MessageCircleMore className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}

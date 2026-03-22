"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Info, LayoutList, Sparkles, Video } from "lucide-react";
import { saveDishAction, type ActionMessage } from "@/actions/admin";
import { DishImageUpload } from "@/components/admin/dish-image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { dishSchema } from "@/lib/validations/admin";

type FormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  youtubeUrl?: string;
  categoryId: string;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

const emptyValues: Omit<FormValues, "categoryId"> = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  imageUrl: "",
  youtubeUrl: "",
  isAvailable: true,
  isFeatured: false,
  sortOrder: 0
};

export function DishForm({
  categories,
  defaultValues
}: {
  categories: { id: string; name: string }[];
  defaultValues?: FormValues;
}) {
  const [message, setMessage] = useState<ActionMessage>({});
  const [isPending, startTransition] = useTransition();
  const hasCategories = categories.length > 0;
  const isEditing = Boolean(defaultValues);

  const formDefaults = useMemo(
    () =>
      defaultValues ?? {
        ...emptyValues,
        categoryId: categories[0]?.id ?? ""
      },
    [categories, defaultValues]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: formDefaults
  });

  const imageUrl = watch("imageUrl") ?? "";
  const youtubeUrl = watch("youtubeUrl") ?? "";
  const imageUrlField = register("imageUrl");

  const onSubmit = handleSubmit((values) => {
    setMessage({});

    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "boolean" ? (value ? "on" : "") : String(value ?? "")
        );
      });

      const result = await saveDishAction(undefined, formData);
      setMessage(result);

      if (result.success && !defaultValues) {
        reset({
          ...emptyValues,
          categoryId: categories[0]?.id ?? ""
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">
            Operação mobile-first
          </p>
          <h3 className="text-2xl font-black tracking-tight text-stone-950">
            {isEditing ? "Editar prato" : "Novo prato"}
          </h3>
          <p className="text-sm leading-6 text-stone-600">
            Cadastre, publique, ajuste status e organize a vitrine do cardápio em um fluxo único.
          </p>
        </div>
      </div>

      <div className="max-h-none space-y-5 overflow-visible px-5 py-5 sm:px-6 2xl:max-h-[calc(100vh-9rem)] 2xl:overflow-y-auto">
        <FormMessage {...message} />

        {!hasCategories ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Cadastre ao menos uma categoria antes de criar pratos.
          </div>
        ) : null}

        <section className="space-y-4 rounded-[28px] border border-[var(--border)] bg-stone-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-2.5 shadow-sm">
              <Info className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-950">Dados principais</h4>
              <p className="mt-1 text-sm leading-6 text-stone-500">
                Garanta um nome claro, preço competitivo e URL pública fácil de compartilhar.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="dish-name">Nome do prato</Label>
              <Input id="dish-name" placeholder="Ex.: X-Bacon Especial" {...register("name")} />
              {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
            </div>

            <div>
              <Label htmlFor="dish-price">Preço</Label>
              <Input
                id="dish-price"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="0,00"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price ? <p className="mt-1 text-xs text-red-600">{errors.price.message}</p> : null}
            </div>

            <div>
              <Label htmlFor="dish-slug">Slug público</Label>
              <Input id="dish-slug" placeholder="x-bacon-especial" {...register("slug")} />
              <p className="mt-1 text-xs text-stone-500">Use um identificador curto para o link e para o QR do prato.</p>
              {errors.slug ? <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p> : null}
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-[28px] border border-[var(--border)] bg-stone-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-2.5 shadow-sm">
              <LayoutList className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-950">Descrição e posicionamento</h4>
              <p className="mt-1 text-sm leading-6 text-stone-500">
                Descreva o prato de forma objetiva e defina onde ele aparece no cardápio.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Descreva ingredientes, acompanhamentos ou diferenciais do prato."
              {...register("description")}
            />
            {errors.description ? (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="categoryId">Categoria</Label>
              <select
                id="categoryId"
                className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                disabled={!hasCategories}
                {...register("categoryId")}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId ? <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p> : null}
            </div>

            <div>
              <Label htmlFor="sortOrder">Ordem de exibição</Label>
              <Input id="sortOrder" type="number" inputMode="numeric" {...register("sortOrder", { valueAsNumber: true })} />
              {errors.sortOrder ? <p className="mt-1 text-xs text-red-600">{errors.sortOrder.message}</p> : null}
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-[28px] border border-[var(--border)] bg-stone-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-2.5 shadow-sm">
              <ImageIcon className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-950">Mídia do prato</h4>
              <p className="mt-1 text-sm leading-6 text-stone-500">
                A foto vende o prato na vitrine pública. Faça upload real pelo celular ou cole uma URL externa.
              </p>
            </div>
          </div>

          <DishImageUpload value={imageUrl} onChange={(value) => setValue("imageUrl", value, { shouldDirty: true, shouldValidate: true })} />

          <input type="hidden" {...imageUrlField} />

          <div>
            <Label htmlFor="imageUrlManual">URL externa da imagem</Label>
            <Input
              id="imageUrlManual"
              name="imageUrlManual"
              placeholder="https://..."
              value={imageUrl}
              onChange={(event) => {
                setValue("imageUrl", event.target.value, { shouldDirty: true, shouldValidate: true });
              }}
            />
            <p className="mt-1 text-xs text-stone-500">
              Opcional para usar um storage externo agora ou migrar depois sem alterar o cadastro.
            </p>
            {errors.imageUrl ? <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p> : null}
          </div>
        </section>

        <section className="space-y-4 rounded-[28px] border border-[var(--border)] bg-stone-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-2.5 shadow-sm">
              <Video className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-950">Vídeo e conversão</h4>
              <p className="mt-1 text-sm leading-6 text-stone-500">
                O vídeo aparece no topo da página pública do prato. Deixe o link pronto para destacar o produto.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
            <Input
              id="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              {...register("youtubeUrl")}
            />
            <p className="mt-1 text-xs text-stone-500">
              Aceita links watch, youtu.be, shorts, embed, live ou somente o ID do vídeo.
            </p>
            {errors.youtubeUrl ? <p className="mt-1 text-xs text-red-600">{errors.youtubeUrl.message}</p> : null}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-stone-600">
            <span className="font-semibold text-stone-900">Status do bloco:</span>{" "}
            {youtubeUrl ? "vídeo configurado para o topo da página pública." : "sem vídeo; a foto será usada como destaque principal."}
          </div>
        </section>

        <section className="space-y-4 rounded-[28px] border border-[var(--border)] bg-stone-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-2.5 shadow-sm">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-950">Status e publicação</h4>
              <p className="mt-1 text-sm leading-6 text-stone-500">
                Controle disponibilidade e destaque promocional sem comprometer a leitura do card.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className={cn("rounded-2xl border border-[var(--border)] bg-white px-4 py-3.5", watch("isAvailable") && "border-emerald-200 bg-emerald-50/70") }>
              <Checkbox
                label="Disponível para pedido"
                {...register("isAvailable")}
                defaultChecked={defaultValues?.isAvailable ?? true}
              />
              <p className="mt-2 pl-6 text-xs leading-5 text-stone-500">Sinaliza o prato como pronto para compra no admin e no front público.</p>
            </div>
            <div className={cn("rounded-2xl border border-[var(--border)] bg-white px-4 py-3.5", watch("isFeatured") && "border-amber-200 bg-amber-50/70") }>
              <Checkbox
                label="Marcar como promocional"
                {...register("isFeatured")}
                defaultChecked={defaultValues?.isFeatured ?? false}
              />
              <p className="mt-2 pl-6 text-xs leading-5 text-stone-500">Destaca o prato com badge refinada e prioridade visual nas vitrines.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-[var(--border)] bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-stone-500">
            {isEditing ? "Atualize dados, mídia e status sem perder o QR público existente." : "Ao salvar, o prato já entra na listagem com link público e QR individual."}
          </p>
          <Button type="submit" disabled={isPending || !hasCategories} className="min-h-12 w-full sm:w-auto sm:min-w-52">
            {isPending ? "Salvando..." : isEditing ? "Atualizar prato" : "Cadastrar prato"}
          </Button>
        </div>
      </div>
    </form>
  );
}

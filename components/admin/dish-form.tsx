"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveDishAction, type ActionMessage } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function DishForm({
  categories,
  defaultValues,
}: {
  categories: { id: string; name: string }[];
  defaultValues?: FormValues;
}) {
  const [message, setMessage] = useState<ActionMessage>({});
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues:
      defaultValues ?? {
        name: "",
        slug: "",
        description: "",
        price: 0,
        imageUrl: "",
        youtubeUrl: "",
        categoryId: categories[0]?.id ?? "",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 0,
      },
  });

  const hasCategories = categories.length > 0;
  const isEditing = Boolean(defaultValues);
  const showOptionalFields = Boolean(
    defaultValues?.imageUrl || defaultValues?.youtubeUrl,
  );

  const onSubmit = handleSubmit((values) => {
    setMessage({});

    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "boolean" ? (value ? "on" : "") : String(value ?? ""),
        );
      });
      const result = await saveDishAction(undefined, formData);
      setMessage(result);
      if (result.success && !defaultValues) {
        reset({
          name: "",
          slug: "",
          description: "",
          price: 0,
          imageUrl: "",
          youtubeUrl: "",
          categoryId: categories[0]?.id ?? "",
          isAvailable: true,
          isFeatured: false,
          sortOrder: 0,
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface grid gap-5 p-5 sm:p-6">
      <input type="hidden" {...register("id")} />

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-stone-950">
          {isEditing ? "Editar prato" : "Novo prato"}
        </h3>
        <p className="text-sm leading-6 text-stone-600">
          Preencha o básico primeiro. Links de imagem e vídeo ficam em uma seção opcional.
        </p>
      </div>

      <FormMessage {...message} />

      {!hasCategories ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Cadastre ao menos uma categoria antes de criar pratos.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="dish-name">Nome</Label>
          <Input
            id="dish-name"
            placeholder="Ex.: X-Bacon Especial"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="dish-price">Preço</Label>
          <Input
            id="dish-price"
            type="number"
            step="0.01"
            inputMode="decimal"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price ? (
            <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          rows={4}
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
            className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
            disabled={!hasCategories}
            {...register("categoryId")}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="sortOrder">Ordem</Label>
          <Input
            id="sortOrder"
            type="number"
            inputMode="numeric"
            {...register("sortOrder", { valueAsNumber: true })}
          />
          {errors.sortOrder ? (
            <p className="mt-1 text-xs text-red-600">{errors.sortOrder.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="dish-slug">Slug</Label>
          <Input id="dish-slug" placeholder="x-bacon-especial" {...register("slug")} />
          <p className="mt-1 text-xs text-stone-500">
            Use um identificador curto para a URL pública do prato.
          </p>
          {errors.slug ? (
            <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-stone-50/70 p-4">
          <p className="text-sm font-semibold text-stone-900">Status</p>
          <div className="mt-3 flex flex-col gap-3 sm:gap-2">
            <Checkbox
              label="Disponível para pedido"
              {...register("isAvailable")}
              defaultChecked={defaultValues?.isAvailable ?? true}
            />
            <Checkbox
              label="Marcar como promocional"
              {...register("isFeatured")}
              defaultChecked={defaultValues?.isFeatured ?? false}
            />
          </div>
        </div>
      </div>

      <details className="rounded-2xl border border-[var(--border)] bg-stone-50/70 p-4" open={showOptionalFields}>
        <summary className="cursor-pointer list-none text-sm font-semibold text-stone-900 [&::-webkit-details-marker]:hidden">
          Mídia e links opcionais
        </summary>
        <p className="mt-2 text-xs leading-5 text-stone-500">
          Adicione imagem e vídeo só quando precisar enriquecer a página pública do prato.
        </p>
        <div className="mt-4 grid gap-4">
          <div>
            <Label htmlFor="imageUrl">Imagem URL</Label>
            <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} />
            {errors.imageUrl ? (
              <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
            <Input
              id="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              {...register("youtubeUrl")}
            />
            <p className="mt-1 text-xs text-stone-500">
              Aceita links watch, youtu.be, shorts, embed ou somente o ID do vídeo.
            </p>
            {errors.youtubeUrl ? (
              <p className="mt-1 text-xs text-red-600">{errors.youtubeUrl.message}</p>
            ) : null}
          </div>
        </div>
      </details>

      <div className="sticky bottom-3 z-10 -mx-5 mt-1 border-t border-[var(--border)] bg-white/95 px-5 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <Button type="submit" disabled={isPending || !hasCategories} className="min-h-12 w-full sm:w-auto">
          {isPending
            ? "Salvando..."
            : isEditing
              ? "Atualizar prato"
              : "Cadastrar prato"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveDishAction } from "@/actions/admin";
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
  defaultValues
}: {
  categories: { id: string; name: string }[];
  defaultValues?: FormValues;
}) {
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: defaultValues ?? {
      name: "",
      slug: "",
      description: "",
      price: 0,
      imageUrl: "",
      youtubeUrl: "",
      categoryId: categories[0]?.id ?? "",
      isAvailable: true,
      isFeatured: false,
      sortOrder: 0
    }
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, typeof value === "boolean" ? (value ? "on" : "") : String(value ?? ""));
      });
      const result = await saveDishAction(undefined, formData);
      setMessage(result);
      if (result.success && !defaultValues) {
        reset();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface grid gap-4 p-5">
      <input type="hidden" {...register("id")} />
      <FormMessage {...message} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="dish-name">Nome</Label>
          <Input id="dish-name" {...register("name")} />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="dish-slug">Slug</Label>
          <Input id="dish-slug" {...register("slug")} />
          {errors.slug ? <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p> : null}
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description.message}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="price">Preço</Label>
          <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="categoryId">Categoria</Label>
          <select id="categoryId" className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" {...register("categoryId")}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="imageUrl">Imagem URL</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
        </div>
        <div>
          <Label htmlFor="youtubeUrl">YouTube URL</Label>
          <Input id="youtubeUrl" {...register("youtubeUrl")} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="sortOrder">Ordem</Label>
          <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
        </div>
        <div className="flex items-end gap-6 pb-3">
          <Checkbox label="Disponível" {...register("isAvailable")} defaultChecked={defaultValues?.isAvailable ?? true} />
          <Checkbox label="Promocional" {...register("isFeatured")} defaultChecked={defaultValues?.isFeatured ?? false} />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : defaultValues ? "Atualizar prato" : "Novo prato"}</Button>
    </form>
  );
}

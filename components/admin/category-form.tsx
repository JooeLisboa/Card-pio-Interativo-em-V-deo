"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveCategoryAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categorySchema } from "@/lib/validations/admin";

type FormValues = {
  id?: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export function CategoryForm({ defaultValues }: { defaultValues?: FormValues }) {
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? { name: "", slug: "", sortOrder: 0 }
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });
      const result = await saveCategoryAction(undefined, formData);
      setMessage(result);
      if (result.success && !defaultValues) {
        reset({ name: "", slug: "", sortOrder: 0 });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface grid gap-4 p-5">
      <input type="hidden" {...register("id")} />
      <FormMessage {...message} />
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" {...register("slug")} />
        {errors.slug ? <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="sortOrder">Ordem</Label>
        <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
      </div>
      <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : defaultValues ? "Atualizar categoria" : "Nova categoria"}</Button>
    </form>
  );
}

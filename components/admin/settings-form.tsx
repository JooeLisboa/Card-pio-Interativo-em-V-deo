"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSettingsAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { settingsSchema } from "@/lib/validations/admin";

type FormValues = {
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  whatsappNumber: string;
};

export function SettingsForm({ defaultValues }: { defaultValues: FormValues }) {
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, String(value ?? "")));
      const result = await saveSettingsAction(undefined, formData);
      setMessage(result);
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface grid gap-4 p-5">
      <FormMessage {...message} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="restaurant-name">Nome</Label>
          <Input id="restaurant-name" {...register("name")} />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="restaurant-slug">Slug</Label>
          <Input id="restaurant-slug" {...register("slug")} />
          {errors.slug ? <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p> : null}
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div>
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input id="logoUrl" {...register("logoUrl")} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="primaryColor">Cor primária</Label>
          <Input id="primaryColor" {...register("primaryColor")} />
        </div>
        <div>
          <Label htmlFor="secondaryColor">Cor secundária</Label>
          <Input id="secondaryColor" {...register("secondaryColor")} />
        </div>
        <div>
          <Label htmlFor="whatsappNumber">WhatsApp</Label>
          <Input id="whatsappNumber" {...register("whatsappNumber")} />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : "Salvar configurações"}</Button>
    </form>
  );
}

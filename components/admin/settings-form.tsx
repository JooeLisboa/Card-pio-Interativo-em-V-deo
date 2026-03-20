"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSettingsAction, type ActionMessage } from "@/actions/admin";
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
  const [message, setMessage] = useState<ActionMessage>({});
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues
  });

  const onSubmit = handleSubmit((values) => {
    setMessage({});

    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, String(value ?? "")));
      const result = await saveSettingsAction(undefined, formData);
      setMessage(result);
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface grid gap-4 p-5 sm:p-6">
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
        {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input id="logoUrl" placeholder="https://..." {...register("logoUrl")} />
        {errors.logoUrl ? <p className="mt-1 text-xs text-red-600">{errors.logoUrl.message}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="primaryColor">Cor primária</Label>
          <Input id="primaryColor" placeholder="#7C3F12" {...register("primaryColor")} />
          {errors.primaryColor ? <p className="mt-1 text-xs text-red-600">{errors.primaryColor.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="secondaryColor">Cor secundária</Label>
          <Input id="secondaryColor" placeholder="#F59E0B" {...register("secondaryColor")} />
          {errors.secondaryColor ? <p className="mt-1 text-xs text-red-600">{errors.secondaryColor.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="whatsappNumber">WhatsApp</Label>
          <Input id="whatsappNumber" placeholder="5511999999999" {...register("whatsappNumber")} />
          {errors.whatsappNumber ? <p className="mt-1 text-xs text-red-600">{errors.whatsappNumber.message}</p> : null}
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="min-h-12">
        {isPending ? "Salvando..." : "Salvar configurações"}
      </Button>
    </form>
  );
}

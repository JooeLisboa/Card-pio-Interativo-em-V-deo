"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveTableAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tableSchema } from "@/lib/validations/admin";

type FormValues = {
  id?: string;
  number: number;
  code: string;
};

export function TableForm({ defaultValues }: { defaultValues?: FormValues }) {
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: defaultValues ?? { number: 1, code: "mesa-1" }
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });
      const result = await saveTableAction(undefined, formData);
      setMessage(result);
      if (result.success && !defaultValues) {
        reset({ number: 1, code: "mesa-1" });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface grid gap-4 p-5">
      <input type="hidden" {...register("id")} />
      <FormMessage {...message} />
      <div>
        <Label htmlFor="table-number">Número</Label>
        <Input id="table-number" type="number" {...register("number", { valueAsNumber: true })} />
        {errors.number ? <p className="mt-1 text-xs text-red-600">{errors.number.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="table-code">Código/slug</Label>
        <Input id="table-code" {...register("code")} />
        {errors.code ? <p className="mt-1 text-xs text-red-600">{errors.code.message}</p> : null}
      </div>
      <Button type="submit" disabled={isPending}>{isPending ? "Salvando..." : defaultValues ? "Atualizar mesa" : "Nova mesa"}</Button>
    </form>
  );
}

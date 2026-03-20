"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validations/admin";

type FormValues = { email: string; password: string };

export function LoginForm() {
  const [message, setMessage] = useState<{ error?: string }>({});
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@sabordacasa.demo", password: "admin123" }
  });

  const onSubmit = handleSubmit((values) => {
    setMessage({});

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      const result = await loginAction(undefined, formData);
      if (result?.error) setMessage(result);
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface grid gap-4 p-6">
      <FormMessage error={message.error} />
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
        {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
      </div>
      <Button type="submit" disabled={isPending} className="min-h-12">{isPending ? "Entrando..." : "Acessar painel"}</Button>
      <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
        Demo: <strong>admin@sabordacasa.demo</strong> / <strong>admin123</strong>
      </div>
    </form>
  );
}

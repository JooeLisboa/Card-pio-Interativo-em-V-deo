import { z } from "zod";
import { hexColorSchema, optionalUrlSchema, slugSchema } from "@/lib/validations/common";

const optionalImageReferenceSchema = z
  .string()
  .trim()
  .refine(
    (value) => !value || value.startsWith("/") || /^https?:\/\//.test(value),
    "Informe uma URL válida ou envie uma imagem."
  )
  .optional()
  .transform((value) => value || undefined);

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9()\-\s]{10,20}$/, "Informe um número de telefone válido.");

const optionalPhoneSchema = z
  .string()
  .trim()
  .refine((value) => !value || /^\+?[0-9()\-\s]{10,20}$/.test(value), "Informe um número de telefone válido.")
  .optional()
  .transform((value) => value || undefined);

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Nome obrigatório.").max(80),
  slug: slugSchema,
  sortOrder: z.coerce.number().int().min(0).max(999)
});

export const dishSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Informe o nome do prato.").max(120),
  slug: slugSchema,
  description: z.string().trim().min(10, "Descreva melhor o prato.").max(500),
  price: z.coerce.number().min(0, "Informe um preço válido."),
  imageUrl: optionalImageReferenceSchema,
  youtubeUrl: optionalUrlSchema,
  categoryId: z.string().min(1, "Selecione uma categoria."),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999)
});

export const tableSchema = z.object({
  id: z.string().optional(),
  number: z.coerce.number().int().min(1, "Informe um número de mesa válido.").max(999),
  code: slugSchema
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: slugSchema,
  description: z.string().trim().min(10).max(200),
  logoUrl: optionalUrlSchema,
  primaryColor: hexColorSchema,
  secondaryColor: hexColorSchema,
  phoneNumber: optionalPhoneSchema,
  whatsappNumber: phoneSchema,
  serviceLabel: z.string().trim().min(8).max(120)
});

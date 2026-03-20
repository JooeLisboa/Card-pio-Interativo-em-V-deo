import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens.");

export const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9A-Fa-f]{6})$/, "Informe uma cor hexadecimal válida.");

export const optionalUrlSchema = z
  .string()
  .trim()
  .url("Informe uma URL válida.")
  .or(z.literal(""))
  .optional()
  .transform((value) => value || undefined);

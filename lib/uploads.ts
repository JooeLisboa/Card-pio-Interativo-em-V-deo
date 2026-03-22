import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const uploadsRoot = path.join(process.cwd(), "public", "uploads", "dishes");
const managedPrefix = "/uploads/dishes/";
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const extensionMap: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif"
};

export const dishUploadConfig = {
  maxBytes: 5 * 1024 * 1024,
  allowedMimeTypes
};

export function isManagedDishUpload(url?: string | null) {
  return Boolean(url?.startsWith(managedPrefix));
}

export async function saveDishImageUpload(file: File) {
  if (!allowedMimeTypes.has(file.type)) {
    throw new Error("Envie uma imagem JPG, PNG, WebP ou AVIF.");
  }

  if (file.size > dishUploadConfig.maxBytes) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }

  const extension = extensionMap[file.type];

  if (!extension) {
    throw new Error("Formato de imagem não suportado.");
  }

  await mkdir(uploadsRoot, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(uploadsRoot, filename);

  await writeFile(filePath, buffer);

  return `${managedPrefix}${filename}`;
}

export async function removeManagedDishUpload(url?: string | null) {
  if (!isManagedDishUpload(url)) {
    return;
  }

  const relativePath = (url as string).slice(1);
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  try {
    await unlink(absolutePath);
  } catch {
    // Ignora casos em que o arquivo já não exista mais.
  }
}

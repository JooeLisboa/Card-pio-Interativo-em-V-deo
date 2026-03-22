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
  driver: (process.env.DISH_IMAGE_STORAGE_DRIVER ?? "local") as "local",
  maxBytes: 5 * 1024 * 1024,
  allowedMimeTypes,
  managedPrefix
};

export type StoredDishImage = {
  storageKey: string;
  storageDriver: "local";
  url: string;
};

type DishImageStorageAdapter = {
  upload: (file: File) => Promise<StoredDishImage>;
  remove: (url?: string | null) => Promise<void>;
  isManaged: (url?: string | null) => boolean;
};

function isManagedDishUpload(url?: string | null) {
  return Boolean(url?.startsWith(managedPrefix));
}

function resolveManagedUploadPath(url: string) {
  const relativePath = url.slice(1);
  return path.join(process.cwd(), "public", relativePath);
}

const localDishImageStorage: DishImageStorageAdapter = {
  async upload(file) {
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

    return {
      storageDriver: "local",
      storageKey: filename,
      url: `${managedPrefix}${filename}`
    };
  },
  async remove(url) {
    if (!url || !isManagedDishUpload(url)) {
      return;
    }

    try {
      await unlink(resolveManagedUploadPath(url));
    } catch {
      // Ignora casos em que o arquivo já não exista mais.
    }
  },
  isManaged: isManagedDishUpload
};

export function getDishImageStorageAdapter(): DishImageStorageAdapter {
  switch (dishUploadConfig.driver) {
    case "local":
    default:
      return localDishImageStorage;
  }
}

export async function uploadDishImage(file: File) {
  return getDishImageStorageAdapter().upload(file);
}

export async function removeManagedDishUpload(url?: string | null) {
  return getDishImageStorageAdapter().remove(url);
}

export function isManagedDishImage(url?: string | null) {
  return getDishImageStorageAdapter().isManaged(url);
}

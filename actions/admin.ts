"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { removeManagedDishUpload } from "@/lib/uploads";
import {
  categorySchema,
  dishSchema,
  settingsSchema,
  tableSchema
} from "@/lib/validations/admin";

export type ActionMessage = { error?: string; success?: string };

function normalizeError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "Já existe um registro com este identificador.";
    }

    if (error.code === "P2003") {
      return "Não foi possível concluir a operação porque este item possui dependências relacionadas.";
    }
  }

  return error instanceof Error ? error.message : "Não foi possível salvar.";
}

function revalidateAdminPaths(restaurantSlug?: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/dishes");
  revalidatePath("/admin/tables");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/analytics");

  if (restaurantSlug) {
    revalidatePath(`/menu/${restaurantSlug}`);
  }
}

export async function saveCategoryAction(
  _prevState: ActionMessage | undefined,
  formData: FormData
): Promise<ActionMessage> {
  const user = await requireAdmin();
  const parsed = categorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder")
  });

  if (!parsed.success || !user.restaurantId) {
    return { error: parsed.success ? "Restaurante não encontrado." : parsed.error.issues[0]?.message };
  }

  try {
    if (parsed.data.id) {
      const result = await prisma.category.updateMany({
        where: { id: parsed.data.id, restaurantId: user.restaurantId },
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          sortOrder: parsed.data.sortOrder
        }
      });

      if (!result.count) {
        return { error: "Categoria não encontrada para este restaurante." };
      }
    } else {
      await prisma.category.create({
        data: {
          restaurantId: user.restaurantId,
          name: parsed.data.name,
          slug: parsed.data.slug,
          sortOrder: parsed.data.sortOrder
        }
      });
    }

    revalidateAdminPaths(user.restaurant?.slug);
    return { success: "Categoria salva com sucesso." };
  } catch (error) {
    return { error: normalizeError(error) };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionMessage> {
  const user = await requireAdmin();

  const result = await prisma.category.deleteMany({
    where: { id, restaurantId: user.restaurantId ?? undefined }
  });

  if (!result.count) {
    return { error: "Categoria não encontrada para este restaurante." };
  }

  revalidateAdminPaths(user.restaurant?.slug);
  return { success: "Categoria removida com sucesso." };
}

export async function saveDishAction(
  _prevState: ActionMessage | undefined,
  formData: FormData
): Promise<ActionMessage> {
  const user = await requireAdmin();
  const parsed = dishSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
    youtubeUrl: formData.get("youtubeUrl"),
    categoryId: formData.get("categoryId"),
    isAvailable: formData.get("isAvailable") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder")
  });

  if (!parsed.success || !user.restaurantId) {
    return { error: parsed.success ? "Restaurante não encontrado." : parsed.error.issues[0]?.message };
  }

  const category = await prisma.category.findFirst({
    where: {
      id: parsed.data.categoryId,
      restaurantId: user.restaurantId
    },
    select: { id: true }
  });

  if (!category) {
    return { error: "Selecione uma categoria válida deste restaurante." };
  }

  const data = {
    categoryId: parsed.data.categoryId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    price: parsed.data.price,
    imageUrl: parsed.data.imageUrl,
    youtubeUrl: parsed.data.youtubeUrl,
    isAvailable: parsed.data.isAvailable,
    isFeatured: parsed.data.isFeatured,
    sortOrder: parsed.data.sortOrder
  };

  try {
    if (parsed.data.id) {
      const existingDish = await prisma.dish.findFirst({
        where: { id: parsed.data.id, restaurantId: user.restaurantId },
        select: { imageUrl: true }
      });

      if (!existingDish) {
        return { error: "Prato não encontrado para este restaurante." };
      }

      const result = await prisma.dish.updateMany({
        where: { id: parsed.data.id, restaurantId: user.restaurantId },
        data
      });

      if (!result.count) {
        return { error: "Prato não encontrado para este restaurante." };
      }

      if (existingDish.imageUrl && existingDish.imageUrl !== data.imageUrl) {
        await removeManagedDishUpload(existingDish.imageUrl);
      }
    } else {
      await prisma.dish.create({ data: { ...data, restaurantId: user.restaurantId } });
    }

    revalidateAdminPaths(user.restaurant?.slug);
    return { success: "Prato salvo com sucesso." };
  } catch (error) {
    return { error: normalizeError(error) };
  }
}

export async function deleteDishAction(id: string): Promise<ActionMessage> {
  const user = await requireAdmin();

  const existingDish = await prisma.dish.findFirst({
    where: { id, restaurantId: user.restaurantId ?? undefined },
    select: { imageUrl: true }
  });

  const result = await prisma.dish.deleteMany({
    where: { id, restaurantId: user.restaurantId ?? undefined }
  });

  if (!result.count) {
    return { error: "Prato não encontrado para este restaurante." };
  }

  await removeManagedDishUpload(existingDish?.imageUrl);
  revalidateAdminPaths(user.restaurant?.slug);
  return { success: "Prato removido com sucesso." };
}

export async function saveTableAction(
  _prevState: ActionMessage | undefined,
  formData: FormData
): Promise<ActionMessage> {
  const user = await requireAdmin();
  const parsed = tableSchema.safeParse({
    id: formData.get("id"),
    number: formData.get("number"),
    code: formData.get("code")
  });

  if (!parsed.success || !user.restaurantId) {
    return { error: parsed.success ? "Restaurante não encontrado." : parsed.error.issues[0]?.message };
  }

  try {
    if (parsed.data.id) {
      const result = await prisma.table.updateMany({
        where: { id: parsed.data.id, restaurantId: user.restaurantId },
        data: { number: parsed.data.number, code: parsed.data.code }
      });

      if (!result.count) {
        return { error: "Mesa não encontrada para este restaurante." };
      }
    } else {
      await prisma.table.create({
        data: {
          restaurantId: user.restaurantId,
          number: parsed.data.number,
          code: parsed.data.code
        }
      });
    }

    revalidateAdminPaths(user.restaurant?.slug);
    return { success: "Mesa salva com sucesso." };
  } catch (error) {
    return { error: normalizeError(error) };
  }
}

export async function deleteTableAction(id: string): Promise<ActionMessage> {
  const user = await requireAdmin();

  const result = await prisma.table.deleteMany({
    where: { id, restaurantId: user.restaurantId ?? undefined }
  });

  if (!result.count) {
    return { error: "Mesa não encontrada para este restaurante." };
  }

  revalidateAdminPaths(user.restaurant?.slug);
  return { success: "Mesa removida com sucesso." };
}

export async function saveSettingsAction(
  _prevState: ActionMessage | undefined,
  formData: FormData
): Promise<ActionMessage> {
  const user = await requireAdmin();
  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    logoUrl: formData.get("logoUrl"),
    primaryColor: formData.get("primaryColor"),
    secondaryColor: formData.get("secondaryColor"),
    whatsappNumber: formData.get("whatsappNumber")
  });

  if (!parsed.success || !user.restaurantId) {
    return { error: parsed.success ? "Restaurante não encontrado." : parsed.error.issues[0]?.message };
  }

  try {
    await prisma.restaurant.update({
      where: { id: user.restaurantId },
      data: parsed.data
    });

    revalidateAdminPaths(user.restaurant?.slug);

    if (user.restaurant?.slug && user.restaurant.slug !== parsed.data.slug) {
      revalidatePath(`/menu/${parsed.data.slug}`);
    }

    return { success: "Configurações salvas com sucesso." };
  } catch (error) {
    return { error: normalizeError(error) };
  }
}

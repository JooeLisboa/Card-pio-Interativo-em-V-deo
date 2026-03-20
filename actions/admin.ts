"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { categorySchema, dishSchema, settingsSchema, tableSchema } from "@/lib/validations/admin";

function normalizeError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "Já existe um registro com este identificador.";
    }
  }

  return error instanceof Error ? error.message : "Não foi possível salvar.";
}

export async function saveCategoryAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
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
      await prisma.category.update({
        where: { id: parsed.data.id },
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          sortOrder: parsed.data.sortOrder
        }
      });
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

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    return { success: "Categoria salva com sucesso." };
  } catch (error) {
    return { error: normalizeError(error) };
  }
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
}

export async function saveDishAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
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
      await prisma.dish.update({ where: { id: parsed.data.id }, data });
    } else {
      await prisma.dish.create({ data: { ...data, restaurantId: user.restaurantId } });
    }

    revalidatePath("/admin/dishes");
    revalidatePath("/admin");
    revalidatePath(`/menu/${user.restaurant?.slug}`);
    return { success: "Prato salvo com sucesso." };
  } catch (error) {
    return { error: normalizeError(error) };
  }
}

export async function deleteDishAction(id: string) {
  const user = await requireAdmin();
  await prisma.dish.delete({ where: { id } });
  revalidatePath("/admin/dishes");
  revalidatePath("/admin");
  revalidatePath(`/menu/${user.restaurant?.slug}`);
}

export async function saveTableAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
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
      await prisma.table.update({
        where: { id: parsed.data.id },
        data: { number: parsed.data.number, code: parsed.data.code }
      });
    } else {
      await prisma.table.create({
        data: {
          restaurantId: user.restaurantId,
          number: parsed.data.number,
          code: parsed.data.code
        }
      });
    }

    revalidatePath("/admin/tables");
    revalidatePath("/admin");
    return { success: "Mesa salva com sucesso." };
  } catch (error) {
    return { error: normalizeError(error) };
  }
}

export async function deleteTableAction(id: string) {
  await requireAdmin();
  await prisma.table.delete({ where: { id } });
  revalidatePath("/admin/tables");
  revalidatePath("/admin");
}

export async function saveSettingsAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
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

    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    revalidatePath(`/menu/${parsed.data.slug}`);
    return { success: "Configurações atualizadas." };
  } catch (error) {
    return { error: normalizeError(error) };
  }
}

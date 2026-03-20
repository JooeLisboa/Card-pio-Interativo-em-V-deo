import { Prisma } from "@prisma/client";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

const publicDishInclude = {
  category: true
} satisfies Prisma.DishInclude;

export async function getRestaurantBySlug(slug: string) {
  return prisma.restaurant.findUnique({ where: { slug } });
}

export async function getMenuByRestaurantSlug(slug: string) {
  return prisma.restaurant.findUnique({
    where: { slug },
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
        include: {
          dishes: {
            orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
          }
        }
      }
    }
  });
}

export async function getDishBySlug(params: { restaurantSlug: string; dishSlug: string }) {
  return prisma.dish.findFirst({
    where: {
      slug: params.dishSlug,
      restaurant: {
        slug: params.restaurantSlug
      }
    },
    include: {
      ...publicDishInclude,
      restaurant: true
    }
  });
}

export async function resolveTableContext(params: {
  restaurantId: string;
  tableParam?: string | null;
}) {
  const tableParam = params.tableParam?.trim();

  if (!tableParam) {
    return null;
  }

  const numericTable = /^\d+$/.test(tableParam)
    ? await prisma.table.findFirst({
        where: {
          restaurantId: params.restaurantId,
          number: Number(tableParam)
        }
      })
    : null;

  if (numericTable) {
    return numericTable;
  }

  return prisma.table.findFirst({
    where: {
      restaurantId: params.restaurantId,
      code: tableParam
    }
  });
}

export async function incrementDishView(params: {
  dishId: string;
  tableId?: string | null;
}) {
  await prisma.$transaction([
    prisma.dish.update({
      where: { id: params.dishId },
      data: { viewsCount: { increment: 1 } }
    }),
    prisma.dishViewEvent.create({
      data: {
        dishId: params.dishId,
        tableId: params.tableId ?? null
      }
    })
  ]);
}

export async function getAdminDashboardData(restaurantId: string) {
  const [restaurant, categories, dishes, tables, totalViews, topDishes] = await Promise.all([
    prisma.restaurant.findUnique({ where: { id: restaurantId } }),
    prisma.category.findMany({ where: { restaurantId }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.dish.findMany({ where: { restaurantId }, include: { category: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.table.findMany({ where: { restaurantId }, orderBy: { number: "asc" } }),
    prisma.dish.aggregate({ where: { restaurantId }, _sum: { viewsCount: true } }),
    prisma.dish.findMany({
      where: { restaurantId },
      orderBy: [{ viewsCount: "desc" }, { name: "asc" }],
      take: 5,
      include: { category: true }
    })
  ]);

  return {
    restaurant,
    categories,
    dishes,
    tables,
    totalViews: totalViews._sum.viewsCount ?? 0,
    topDishes
  };
}

export async function getQrCodeDataUrl(value: string) {
  return QRCode.toDataURL(value, {
    width: 256,
    margin: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: "#1d1a17",
      light: "#ffffff"
    }
  });
}

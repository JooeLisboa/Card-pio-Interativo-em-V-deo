import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "sabor-da-casa" },
    update: {
      name: "Sabor da Casa",
      description: "Cardápio digital com vídeos dos pratos",
      whatsappNumber: "5514999999999",
      logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
      primaryColor: "#7C3F12",
      secondaryColor: "#F59E0B"
    },
    create: {
      name: "Sabor da Casa",
      slug: "sabor-da-casa",
      description: "Cardápio digital com vídeos dos pratos",
      whatsappNumber: "5514999999999",
      logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
      primaryColor: "#7C3F12",
      secondaryColor: "#F59E0B"
    }
  });

  const categoriesData = [
    { name: "Entradas", slug: "entradas", sortOrder: 1 },
    { name: "Pratos Principais", slug: "pratos-principais", sortOrder: 2 },
    { name: "Bebidas", slug: "bebidas", sortOrder: 3 },
    { name: "Sobremesas", slug: "sobremesas", sortOrder: 4 }
  ];

  const categories = await Promise.all(categoriesData.map((category) => prisma.category.upsert({
    where: { restaurantId_slug: { restaurantId: restaurant.id, slug: category.slug } },
    update: category,
    create: { ...category, restaurantId: restaurant.id }
  })));

  const bySlug = Object.fromEntries(categories.map((category) => [category.slug, category.id]));

  const dishes = [
    { categorySlug: "entradas", name: "Bruschetta da Casa", slug: "bruschetta-da-casa", description: "Pães artesanais tostados com tomate confit, parmesão e manjericão fresco.", price: 24.9, imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=80", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", isFeatured: true, sortOrder: 1 },
    { categorySlug: "entradas", name: "Croquete de Costela", slug: "croquete-de-costela", description: "Croquetes cremosos de costela desfiada com maionese defumada.", price: 29.9, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80", youtubeUrl: null, isFeatured: false, sortOrder: 2 },
    { categorySlug: "pratos-principais", name: "X-Bacon Especial", slug: "x-bacon-especial", description: "Blend artesanal, bacon crocante, cheddar, cebola caramelizada e maionese da casa.", price: 38.5, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80", youtubeUrl: "https://youtu.be/ysz5S6PUM-U", isFeatured: true, sortOrder: 1 },
    { categorySlug: "pratos-principais", name: "Parmegiana Premium", slug: "parmegiana-premium", description: "Filé empanado com molho rústico, queijo gratinado e arroz cremoso.", price: 54.9, imageUrl: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=900&q=80", youtubeUrl: null, isFeatured: false, sortOrder: 2 },
    { categorySlug: "pratos-principais", name: "Risoto de Funghi", slug: "risoto-de-funghi", description: "Arroz arbório, cogumelos frescos e finalização com azeite trufado.", price: 49.9, imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80", youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", isFeatured: false, sortOrder: 3 },
    { categorySlug: "bebidas", name: "Limonada Siciliana", slug: "limonada-siciliana", description: "Refrescante, equilibrada e finalizada com hortelã.", price: 14.9, imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80", youtubeUrl: null, isFeatured: true, sortOrder: 1 },
    { categorySlug: "bebidas", name: "Pink Lemonade", slug: "pink-lemonade", description: "Limonada com frutas vermelhas e gás, perfeita para harmonizar.", price: 16.9, imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80", youtubeUrl: null, isFeatured: false, sortOrder: 2 },
    { categorySlug: "sobremesas", name: "Brownie com Gelato", slug: "brownie-com-gelato", description: "Brownie intenso com gelato de baunilha e calda quente de chocolate.", price: 22.9, imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80", youtubeUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE", isFeatured: true, sortOrder: 1 },
    { categorySlug: "sobremesas", name: "Cheesecake de Frutas Vermelhas", slug: "cheesecake-frutas-vermelhas", description: "Base crocante, creme leve e coulis artesanal.", price: 19.9, imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80", youtubeUrl: null, isFeatured: false, sortOrder: 2 }
  ];

  for (const dish of dishes) {
    await prisma.dish.upsert({
      where: { restaurantId_slug: { restaurantId: restaurant.id, slug: dish.slug } },
      update: {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        imageUrl: dish.imageUrl,
        youtubeUrl: dish.youtubeUrl,
        isAvailable: true,
        isFeatured: dish.isFeatured,
        sortOrder: dish.sortOrder,
        categoryId: bySlug[dish.categorySlug]
      },
      create: {
        restaurantId: restaurant.id,
        categoryId: bySlug[dish.categorySlug],
        name: dish.name,
        slug: dish.slug,
        description: dish.description,
        price: dish.price,
        imageUrl: dish.imageUrl,
        youtubeUrl: dish.youtubeUrl,
        isAvailable: true,
        isFeatured: dish.isFeatured,
        sortOrder: dish.sortOrder
      }
    });
  }

  for (const tableNumber of [1, 2, 3, 10]) {
    await prisma.table.upsert({
      where: { restaurantId_number: { restaurantId: restaurant.id, number: tableNumber } },
      update: { code: `mesa-${tableNumber}` },
      create: {
        restaurantId: restaurant.id,
        number: tableNumber,
        code: `mesa-${tableNumber}`
      }
    });
  }

  await prisma.user.upsert({
    where: { email: "admin@sabordacasa.demo" },
    update: {
      name: "Admin Demo",
      passwordHash,
      role: "ADMIN",
      restaurantId: restaurant.id
    },
    create: {
      name: "Admin Demo",
      email: "admin@sabordacasa.demo",
      passwordHash,
      role: "ADMIN",
      restaurantId: restaurant.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

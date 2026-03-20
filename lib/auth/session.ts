import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id || !session.user.role) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { restaurant: true }
  });

  if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
    redirect("/admin/login");
  }

  return user;
}

import Link from "next/link";
import { deleteCategoryAction } from "@/actions/admin";
import { CategoryForm } from "@/components/admin/category-form";
import { SectionHeader } from "@/components/admin/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/data";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminCategoriesPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const user = await requireAdmin();
  const data = await getAdminDashboardData(user.restaurantId!);
  const { edit } = await searchParams;
  const editing = data.categories.find((category) => category.id === edit);

  return (
    <div className="space-y-6">
      <SectionHeader title="Categorias" description="Organize o cardápio por seções com ordenação e slugs amigáveis." />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <CategoryForm defaultValues={editing ? { id: editing.id, name: editing.name, slug: editing.slug, sortOrder: editing.sortOrder } : undefined} />
        <Card className="p-6">
          {data.categories.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-stone-500">
                  <tr>
                    <th className="pb-3">Nome</th>
                    <th className="pb-3">Slug</th>
                    <th className="pb-3">Ordem</th>
                    <th className="pb-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map((category) => (
                    <tr key={category.id} className="border-t border-[var(--border)] align-top">
                      <td className="py-4 font-medium text-stone-900">{category.name}</td>
                      <td className="py-4 text-stone-500">{category.slug}</td>
                      <td className="py-4 text-stone-500">{category.sortOrder}</td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline">
                            <Link href={`/admin/categories?edit=${category.id}`}>Editar</Link>
                          </Button>
                          <form action={deleteCategoryAction.bind(null, category.id)}>
                            <Button variant="danger">Excluir</Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-stone-500">
              Nenhuma categoria cadastrada ainda. Crie a primeira categoria para habilitar o cadastro de pratos.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

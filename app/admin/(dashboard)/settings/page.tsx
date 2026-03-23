import { SettingsForm } from "@/components/admin/settings-form";
import { SectionHeader } from "@/components/admin/section-header";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminSettingsPage() {
  const user = await requireAdmin();

  if (!user.restaurant) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Configurações do restaurante" description="Defina identidade visual, contatos públicos, texto de entrega/retirada e dados institucionais." />
        <Card className="p-6 text-sm text-stone-500">Nenhum restaurante vinculado ao usuário autenticado.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Configurações do restaurante" description="Defina identidade visual, contatos públicos, texto de entrega/retirada e dados institucionais." />
      <SettingsForm
        defaultValues={{
          name: user.restaurant.name,
          slug: user.restaurant.slug,
          description: user.restaurant.description,
          logoUrl: user.restaurant.logoUrl ?? "",
          primaryColor: user.restaurant.primaryColor,
          secondaryColor: user.restaurant.secondaryColor,
          phoneNumber: user.restaurant.phoneNumber ?? "",
          whatsappNumber: user.restaurant.whatsappNumber,
          serviceLabel: user.restaurant.serviceLabel
        }}
      />
    </div>
  );
}

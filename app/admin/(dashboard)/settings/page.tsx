import { SettingsForm } from "@/components/admin/settings-form";
import { SectionHeader } from "@/components/admin/section-header";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminSettingsPage() {
  const user = await requireAdmin();

  if (!user.restaurant) {
    return null;
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Configurações do restaurante" description="Defina identidade visual, slug público, WhatsApp e dados institucionais." />
      <SettingsForm
        defaultValues={{
          name: user.restaurant.name,
          slug: user.restaurant.slug,
          description: user.restaurant.description,
          logoUrl: user.restaurant.logoUrl ?? "",
          primaryColor: user.restaurant.primaryColor,
          secondaryColor: user.restaurant.secondaryColor,
          whatsappNumber: user.restaurant.whatsappNumber
        }}
      />
    </div>
  );
}

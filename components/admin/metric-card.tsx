export function MetricCard({ label, value, description }: { label: string; value: string | number; description: string }) {
  return (
    <div className="surface p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-stone-950">{value}</p>
      <p className="mt-2 text-sm text-stone-600">{description}</p>
    </div>
  );
}

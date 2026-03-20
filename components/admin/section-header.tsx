export function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <h2 className="text-2xl font-black tracking-tight text-stone-950">{title}</h2>
      <p className="text-sm leading-6 text-stone-600">{description}</p>
    </div>
  );
}

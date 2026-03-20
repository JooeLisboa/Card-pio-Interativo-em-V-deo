export default function AdminDashboardLoading() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="surface h-28 animate-pulse bg-white/70" />
      ))}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_360px]">
        <div className="surface h-80 animate-pulse bg-white/70" />
        <div className="surface h-80 animate-pulse bg-white/70" />
      </div>
    </div>
  );
}

export default function MenuLoading() {
  return (
    <main className="container-shell py-6">
      <div className="surface h-52 animate-pulse bg-white/70" />
      <div className="mt-5 surface h-16 animate-pulse bg-white/70" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="surface h-80 animate-pulse bg-white/70" />
        ))}
      </div>
    </main>
  );
}

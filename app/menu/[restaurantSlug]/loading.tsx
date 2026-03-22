export default function MenuLoading() {
  return (
    <main className="container-shell py-5 sm:py-6">
      <div className="surface h-56 animate-pulse bg-white/70" />
      <div className="mt-4 surface h-16 animate-pulse bg-white/70" />
      <div className="mt-6 space-y-8">
        {Array.from({ length: 2 }).map((_, sectionIndex) => (
          <section key={sectionIndex} className="space-y-4">
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded-full bg-stone-200" />
              <div className="h-8 w-40 animate-pulse rounded-full bg-stone-200" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="surface overflow-hidden">
                  <div className="h-52 animate-pulse bg-stone-200/80" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-20 animate-pulse rounded-full bg-stone-200" />
                    <div className="h-6 w-3/4 animate-pulse rounded-full bg-stone-200" />
                    <div className="h-14 animate-pulse rounded-2xl bg-stone-200/80" />
                    <div className="h-12 animate-pulse rounded-2xl bg-stone-200/80" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default function DishLoading() {
  return (
    <main className="container-shell py-5 sm:py-6">
      <div className="mb-4 h-11 w-40 animate-pulse rounded-2xl bg-stone-200" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-4">
          <div className="surface h-[24rem] animate-pulse bg-white/70 sm:h-[30rem]" />
          <div className="surface space-y-4 p-5 sm:p-6">
            <div className="flex gap-2">
              <div className="h-7 w-24 animate-pulse rounded-full bg-stone-200" />
              <div className="h-7 w-32 animate-pulse rounded-full bg-stone-200" />
            </div>
            <div className="h-10 w-3/4 animate-pulse rounded-full bg-stone-200" />
            <div className="h-12 w-32 animate-pulse rounded-full bg-stone-200" />
            <div className="h-24 animate-pulse rounded-3xl bg-stone-200/80" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-12 animate-pulse rounded-2xl bg-stone-200/80" />
              <div className="h-12 animate-pulse rounded-2xl bg-stone-200/80" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="surface h-44 animate-pulse bg-white/70" />
          <div className="surface h-44 animate-pulse bg-white/70" />
        </div>
      </div>
    </main>
  );
}

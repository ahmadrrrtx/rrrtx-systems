export function PageSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <main className="min-h-screen bg-[#020617]" aria-busy="true" aria-label="Loading page">
      <div className="h-16 lg:h-20 border-b border-white/5 bg-[#020617]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          <div className="skeleton h-3 w-32 mx-auto" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-5 w-4/5 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: cards }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-800/50 p-6 space-y-4">
              <div className="skeleton aspect-video w-full" />
              <div className="skeleton h-6 w-4/5" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading content</span>
    </main>
  );
}

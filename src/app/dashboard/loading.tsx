export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#020617] p-6 lg:p-10" aria-busy="true">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="skeleton h-9 w-56" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="skeleton h-96 rounded-xl" />
      </div>
      <span className="sr-only">Loading dashboard</span>
    </main>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-3">
        <div className="h-3 w-28 animate-pulse rounded-full bg-[var(--surface-2)]" />
        <div className="h-12 w-96 max-w-full animate-pulse rounded-full bg-[var(--surface)]" />
        <div className="h-4 w-[32rem] max-w-full animate-pulse rounded-full bg-[var(--surface)]" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-[140px] w-[220px] animate-pulse rounded-[24px] bg-[var(--surface)]" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-[220px] animate-pulse rounded-[28px] bg-[var(--surface)]" />
        ))}
      </div>
      <div className="h-[320px] animate-pulse rounded-[32px] bg-[var(--surface)]" />
    </div>
  );
}

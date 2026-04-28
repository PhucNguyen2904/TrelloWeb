export default function BoardLoading() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between gap-3">
        <div className="h-10 w-36 animate-pulse rounded-full bg-[var(--surface)]" />
        <div className="h-10 w-28 animate-pulse rounded-full bg-[var(--surface)]" />
      </div>
      <div className="h-[140px] animate-pulse rounded-[28px] bg-[var(--surface)]" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-[420px] min-w-[280px] animate-pulse rounded-[20px] bg-[var(--surface)]" />
        ))}
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[16px] bg-white shadow-sm" />
        ))}
      </div>
      <div className="rounded-[16px] border border-border bg-white p-4 shadow-sm">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="mb-3 h-12 animate-pulse rounded-2xl bg-[#F3F4F6] last:mb-0" />
        ))}
      </div>
    </div>
  );
}

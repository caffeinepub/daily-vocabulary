export function WordCardSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border bg-card overflow-hidden"
      data-ocid="word.loading_state"
    >
      <div className="h-1 bg-border animate-shimmer" />
      <div className="p-6 md:p-8 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-4 w-16 rounded-full bg-muted animate-shimmer" />
            <div className="h-12 w-48 rounded-lg bg-muted animate-shimmer" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-muted animate-shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted animate-shimmer" />
          <div className="h-4 w-5/6 rounded bg-muted animate-shimmer" />
          <div className="h-4 w-4/6 rounded bg-muted animate-shimmer" />
        </div>
        <div className="pl-4 border-l-2 border-border space-y-1">
          <div className="h-3 w-full rounded bg-muted animate-shimmer" />
          <div className="h-3 w-3/4 rounded bg-muted animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

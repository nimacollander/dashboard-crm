import { Card } from "@/components/ui/Card";

const ROWS = 8;

export function ContactsTableSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading contacts">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-80 max-w-full animate-pulse rounded-lg bg-slate-100" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-slate-100 sm:w-72" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: ROWS }, (_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3">
            <div className="size-8 animate-pulse rounded-full bg-slate-100" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-56 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="hidden h-3 w-24 animate-pulse rounded bg-slate-100 sm:block" />
          </div>
        ))}
      </div>
    </Card>
  );
}

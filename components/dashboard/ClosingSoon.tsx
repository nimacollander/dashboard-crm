import Link from "next/link";
import { CalendarIcon } from "@/components/icons";
import { Card, CardHeader } from "@/components/ui/Card";
import { DEAL_STAGES } from "@/lib/deal-stages";
import { formatCompactCurrency, formatShortDate } from "@/lib/format";
import type { UpcomingDeal } from "@/types";

interface ClosingSoonProps {
  deals: UpcomingDeal[];
}

function describeDays(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export function ClosingSoon({ deals }: ClosingSoonProps) {
  return (
    <Card>
      <CardHeader
        title="Closing soon"
        description="Open deals by expected close date"
        action={
          <Link href="/deals" className="text-sm font-medium text-accent-600 hover:text-accent-700">
            View all
          </Link>
        }
      />
      {deals.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-slate-500">
          No open deals are due to close. Add one from the Deals board.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {deals.map((deal) => {
            const stage = DEAL_STAGES.find((item) => item.id === deal.stage);
            return (
              <li key={deal.id} className="flex items-center gap-4 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{deal.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    <Link href={`/contacts/${deal.contact.id}`} className="hover:text-accent-600 hover:underline">
                      {deal.contact.company}
                    </Link>
                    <span aria-hidden="true"> · </span>
                    <span className="inline-flex items-center gap-1">
                      <span className={`size-1.5 rounded-full ${stage?.dotClass}`} aria-hidden="true" />
                      {stage?.label}
                    </span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCompactCurrency(deal.value)}
                  </p>
                  <p
                    className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500"
                    title={formatShortDate(deal.expectedClose)}
                  >
                    <CalendarIcon className="size-3" />
                    {describeDays(deal.daysUntilClose)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

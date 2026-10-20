import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarIcon } from "@/components/icons";
import { DEMO_TODAY } from "@/lib/demo-date";
import { formatCurrency, formatDate, formatShortDate, getInitials } from "@/lib/format";
import type { DealWithContact } from "@/types";

interface DealCardProps {
  deal: DealWithContact;
  /** Slot for the drag handle, so the card itself stays presentational. */
  handle?: ReactNode;
  className?: string;
}

export function DealCard({ deal, handle, className = "" }: DealCardProps) {
  return (
    <article
      className={`rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm leading-snug font-medium text-slate-900">
          <Link
            href={`/contacts/${deal.contact.id}`}
            className="hover:text-accent-600 hover:underline"
          >
            {deal.title}
          </Link>
        </h3>
        {handle}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900 tabular-nums">
          {formatCurrency(deal.value)}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1 text-xs whitespace-nowrap text-slate-500"
            title={`Expected close: ${formatDate(deal.expectedClose)}`}
          >
            <CalendarIcon className="size-3.5" />
            {/* The year only appears when it isn't the current one. */}
            {deal.expectedClose.startsWith(DEMO_TODAY.slice(0, 4))
              ? formatShortDate(deal.expectedClose)
              : formatDate(deal.expectedClose)}
          </span>
          <span
            className="flex size-6 items-center justify-center rounded-full bg-accent-50 text-[10px] font-semibold text-accent-700"
            title={`Owner: ${deal.owner}`}
          >
            {getInitials(deal.owner)}
          </span>
        </div>
      </div>
    </article>
  );
}

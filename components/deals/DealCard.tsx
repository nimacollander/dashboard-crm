import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarIcon } from "@/components/icons";
import { formatCurrency, formatDate, getInitials } from "@/lib/format";
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
      className={`rounded-lg border border-zinc-200 bg-white p-3.5 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm leading-snug font-medium text-zinc-900">
          {deal.title}
        </h3>
        {handle}
      </div>

      <Link
        href={`/contacts/${deal.contact.id}`}
        className="mt-1 block truncate text-xs text-zinc-500 hover:text-indigo-600 hover:underline"
      >
        {deal.contact.name} · {deal.contact.company}
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-900 tabular-nums">
          {formatCurrency(deal.value)}
        </span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <CalendarIcon className="size-3.5" />
            {formatDate(deal.expectedClose)}
          </span>
          <span
            className="flex size-6 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-semibold text-indigo-700"
            title={`Owner: ${deal.owner}`}
          >
            {getInitials(deal.owner)}
          </span>
        </div>
      </div>
    </article>
  );
}

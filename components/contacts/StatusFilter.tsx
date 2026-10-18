import Link from "next/link";
import {
  buildContactsHref,
  CONTACT_STATUSES,
  STATUS_FILTER_LABELS,
} from "@/lib/contacts";
import type { ContactFilters, ContactStatusFilter, StatusCounts } from "@/types";

const OPTIONS: ContactStatusFilter[] = ["all", ...CONTACT_STATUSES];

interface StatusFilterProps {
  filters: ContactFilters;
  counts: StatusCounts;
}

export function StatusFilter({ filters, counts }: StatusFilterProps) {
  return (
    <nav aria-label="Filter by status" className="-mx-1 overflow-x-auto">
      <ul className="flex gap-1 px-1">
        {OPTIONS.map((status) => {
          const active = filters.status === status;
          return (
            <li key={status}>
              <Link
                href={buildContactsHref(filters, { status })}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {STATUS_FILTER_LABELS[status]}
                <span
                  className={`rounded-full px-1.5 text-xs tabular-nums ${
                    active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {counts[status]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

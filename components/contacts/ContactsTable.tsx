import Link from "next/link";
import { ContactAvatar } from "@/components/contacts/ContactAvatar";
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from "@/components/icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getSortHref } from "@/lib/contacts";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Contact, ContactFilters, ContactSortKey } from "@/types";

interface Column {
  label: string;
  sortKey?: ContactSortKey;
  align?: "left" | "right";
}

const COLUMNS: Column[] = [
  { label: "Name", sortKey: "name" },
  { label: "Company" },
  { label: "Status" },
  { label: "Deal Value", sortKey: "dealValue", align: "right" },
  { label: "Last Contacted", sortKey: "lastContacted", align: "right" },
];

interface ContactsTableProps {
  contacts: Contact[];
  /** When provided, sortable column headers become links that update the URL. */
  filters?: ContactFilters;
}

export function ContactsTable({ contacts, filters }: ContactsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          <tr>
            {COLUMNS.map((column) => (
              <HeaderCell key={column.label} column={column} filters={filters} />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {contacts.map((contact) => (
            <tr key={contact.id} className="group hover:bg-slate-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <ContactAvatar name={contact.name} />
                  <div className="min-w-0">
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="font-medium text-slate-900 group-hover:text-accent-600 hover:underline"
                    >
                      {contact.name}
                    </Link>
                    <p className="truncate text-xs text-slate-500">{contact.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-slate-600">{contact.company}</td>
              <td className="px-5 py-3">
                <StatusBadge status={contact.status} />
              </td>
              <td className="px-5 py-3 text-right text-slate-900 tabular-nums">
                {formatCurrency(contact.dealValue)}
              </td>
              <td className="px-5 py-3 text-right text-slate-500 tabular-nums">
                {formatDate(contact.lastContacted)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface HeaderCellProps {
  column: Column;
  filters?: ContactFilters;
}

function HeaderCell({ column, filters }: HeaderCellProps) {
  const alignClass = column.align === "right" ? "text-right" : "text-left";

  if (!filters || !column.sortKey) {
    return (
      <th scope="col" className={`px-5 py-3 ${alignClass}`}>
        {column.label}
      </th>
    );
  }

  const isSorted = filters.sort === column.sortKey;
  const SortIcon = !isSorted
    ? ChevronUpDownIcon
    : filters.order === "asc"
      ? ChevronUpIcon
      : ChevronDownIcon;

  return (
    <th
      scope="col"
      className={`px-5 py-3 ${alignClass}`}
      aria-sort={
        isSorted ? (filters.order === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <Link
        href={getSortHref(filters, column.sortKey)}
        scroll={false}
        className={`inline-flex items-center gap-1 uppercase hover:text-slate-900 ${
          isSorted ? "text-slate-900" : ""
        } ${column.align === "right" ? "flex-row-reverse" : ""}`}
      >
        {column.label}
        <SortIcon
          className={`size-3.5 ${isSorted ? "text-accent-600" : "text-slate-400"}`}
        />
      </Link>
    </th>
  );
}

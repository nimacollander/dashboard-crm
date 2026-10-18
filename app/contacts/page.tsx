import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactSearch } from "@/components/contacts/ContactSearch";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { ContactsTableSkeleton } from "@/components/contacts/ContactsTableSkeleton";
import { StatusFilter } from "@/components/contacts/StatusFilter";
import { Card } from "@/components/ui/Card";
import { parseContactFilters, queryContacts } from "@/lib/contacts";

export const metadata: Metadata = { title: "Contacts" };

// Not async: the heading is prerendered as part of the static shell, and only
// the results (which depend on the URL's search params) render per request.
export default function ContactsPage({ searchParams }: PageProps<"/contacts">) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Contacts
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Every person and company in your pipeline.
        </p>
      </div>

      <Suspense fallback={<ContactsTableSkeleton />}>
        <ContactsResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

interface ContactsResultsProps {
  searchParams: PageProps<"/contacts">["searchParams"];
}

async function ContactsResults({ searchParams }: ContactsResultsProps) {
  const filters = parseContactFilters(await searchParams);
  const { contacts, statusCounts, total } = queryContacts(filters);
  const hasFilters = filters.q !== "" || filters.status !== "all";

  return (
    <Card>
      <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <StatusFilter filters={filters} counts={statusCounts} />
        <ContactSearch filters={filters} />
      </div>

      {contacts.length > 0 ? (
        <ContactsTable contacts={contacts} filters={filters} />
      ) : (
        <div className="px-5 py-16 text-center">
          <p className="text-sm font-medium text-zinc-900">No contacts found</p>
          <p className="mt-1 text-sm text-zinc-500">
            {filters.q
              ? `Nothing matches “${filters.q}”. Try a different search.`
              : "No contacts have this status yet."}
          </p>
          <Link
            href="/contacts"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Clear filters
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
        <span>
          Showing <span className="font-medium text-zinc-900">{contacts.length}</span>{" "}
          of {total} contacts
        </span>
        {hasFilters && contacts.length > 0 && (
          <Link href="/contacts" className="font-medium text-indigo-600 hover:text-indigo-700">
            Clear filters
          </Link>
        )}
      </div>
    </Card>
  );
}

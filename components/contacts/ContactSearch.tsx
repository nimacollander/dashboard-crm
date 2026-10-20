"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { SearchIcon } from "@/components/icons";
import { buildContactsHref } from "@/lib/contacts";
import type { ContactFilters } from "@/types";

const DEBOUNCE_MS = 300;

interface ContactSearchProps {
  filters: ContactFilters;
}

export function ContactSearch({ filters }: ContactSearchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(filters.q);
  // The last query this input pushed to the URL. If the URL's query differs
  // from it, something else changed the URL (e.g. the header search), so we
  // sync the input instead of clobbering what the user is typing.
  const [pushedQuery, setPushedQuery] = useState(filters.q);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  if (filters.q !== pushedQuery) {
    setPushedQuery(filters.q);
    setValue(filters.q);
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handleChange(next: string) {
    setValue(next);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const q = next.trim();
      setPushedQuery(q);
      startTransition(() => {
        router.replace(buildContactsHref(filters, { q }), { scroll: false });
      });
    }, DEBOUNCE_MS);
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Search name or email…"
        aria-label="Search contacts"
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-9 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 focus:outline-none"
      />
      {isPending && (
        <span
          className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-200 border-t-accent-600"
          role="status"
          aria-label="Searching"
        />
      )}
    </div>
  );
}

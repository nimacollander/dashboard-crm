import { CONTACTS } from "@/lib/mock-data";
import type {
  Contact,
  ContactFilters,
  ContactQueryResult,
  ContactSortKey,
  ContactStatus,
  ContactStatusFilter,
  SortOrder,
  StatusCounts,
} from "@/types";

/**
 * Data-access layer for contacts. Everything reads from mock data today;
 * swap these function bodies for database or API calls later without
 * touching the components that use them.
 */

export const CONTACT_STATUSES: readonly ContactStatus[] = [
  "lead",
  "prospect",
  "customer",
  "churned",
];

/** The natural first direction for each column when it becomes the sort key. */
const DEFAULT_ORDER: Record<ContactSortKey, SortOrder> = {
  name: "asc",
  dealValue: "desc",
  lastContacted: "desc",
};

const SORT_KEYS = Object.keys(DEFAULT_ORDER) as ContactSortKey[];

export const DEFAULT_FILTERS: ContactFilters = {
  q: "",
  status: "all",
  sort: "lastContacted",
  order: "desc",
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isContactStatus(value: unknown): value is ContactStatus {
  return CONTACT_STATUSES.includes(value as ContactStatus);
}

function isSortKey(value: unknown): value is ContactSortKey {
  return SORT_KEYS.includes(value as ContactSortKey);
}

/** Turns untrusted URL search params into a fully-populated, valid filter object. */
export function parseContactFilters(params: RawSearchParams): ContactFilters {
  const status = firstValue(params.status);
  const sortParam = firstValue(params.sort);
  const order = firstValue(params.order);
  const sort = isSortKey(sortParam) ? sortParam : DEFAULT_FILTERS.sort;

  return {
    q: firstValue(params.q)?.trim() ?? "",
    status: isContactStatus(status) ? status : DEFAULT_FILTERS.status,
    sort,
    order: order === "asc" || order === "desc" ? order : DEFAULT_ORDER[sort],
  };
}

/** Builds a /contacts URL, leaving out any value that matches its default. */
export function buildContactsHref(
  filters: ContactFilters,
  overrides: Partial<ContactFilters> = {},
): string {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.q) params.set("q", next.q);
  if (next.status !== DEFAULT_FILTERS.status) params.set("status", next.status);
  if (next.sort !== DEFAULT_FILTERS.sort) params.set("sort", next.sort);
  if (next.order !== DEFAULT_ORDER[next.sort]) params.set("order", next.order);

  const query = params.toString();
  return query ? `/contacts?${query}` : "/contacts";
}

/** Clicking the active column flips its direction; any other column starts at its default. */
export function getSortHref(filters: ContactFilters, key: ContactSortKey): string {
  const order: SortOrder =
    filters.sort === key
      ? filters.order === "asc"
        ? "desc"
        : "asc"
      : DEFAULT_ORDER[key];
  return buildContactsHref(filters, { sort: key, order });
}

function matchesQuery(contact: Contact, query: string): boolean {
  if (!query) return true;
  const needle = query.toLowerCase();
  return [contact.name, contact.email, contact.company].some((field) =>
    field.toLowerCase().includes(needle),
  );
}

function compareContacts(a: Contact, b: Contact, key: ContactSortKey): number {
  switch (key) {
    case "name":
      return a.name.localeCompare(b.name);
    case "dealValue":
      return a.dealValue - b.dealValue;
    case "lastContacted":
      // ISO dates sort correctly as strings.
      return a.lastContacted.localeCompare(b.lastContacted);
  }
}

function countByStatus(contacts: Contact[]): StatusCounts {
  const counts: StatusCounts = {
    all: contacts.length,
    lead: 0,
    prospect: 0,
    customer: 0,
    churned: 0,
  };
  for (const contact of contacts) counts[contact.status] += 1;
  return counts;
}

export function queryContacts(filters: ContactFilters): ContactQueryResult {
  // Status counts reflect the search query, so each tab shows how many
  // results you would get by switching to it.
  const matching = CONTACTS.filter((contact) => matchesQuery(contact, filters.q));
  const direction = filters.order === "asc" ? 1 : -1;

  const contacts = matching
    .filter(
      (contact) => filters.status === "all" || contact.status === filters.status,
    )
    .sort((a, b) => compareContacts(a, b, filters.sort) * direction);

  return {
    contacts,
    statusCounts: countByStatus(matching),
    total: CONTACTS.length,
  };
}

export function getAllContacts(): Contact[] {
  return CONTACTS;
}

export function getContactById(id: string): Contact | undefined {
  return CONTACTS.find((contact) => contact.id === id);
}

export function getRecentContacts(limit: number): Contact[] {
  return queryContacts(DEFAULT_FILTERS).contacts.slice(0, limit);
}

export const STATUS_FILTER_LABELS: Record<ContactStatusFilter, string> = {
  all: "All",
  lead: "Leads",
  prospect: "Prospects",
  customer: "Customers",
  churned: "Churned",
};

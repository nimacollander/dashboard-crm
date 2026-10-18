import type { ComponentType, SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavItem {
  label: string;
  href: string;
  icon: IconComponent;
}

export type TrendDirection = "up" | "down";

export interface Metric {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: TrendDirection;
  icon: IconComponent;
}

export type ContactStatus = "lead" | "prospect" | "customer" | "churned";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  location: string;
  status: ContactStatus;
  dealValue: number;
  lastContacted: string; // ISO date
  createdAt: string; // ISO date
}

export type ContactStatusFilter = ContactStatus | "all";
export type ContactSortKey = "name" | "dealValue" | "lastContacted";
export type SortOrder = "asc" | "desc";

export interface ContactFilters {
  q: string;
  status: ContactStatusFilter;
  sort: ContactSortKey;
  order: SortOrder;
}

export type StatusCounts = Record<ContactStatusFilter, number>;

export interface ContactQueryResult {
  contacts: Contact[];
  statusCounts: StatusCounts;
  total: number;
}

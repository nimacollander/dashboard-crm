import type { ComponentType, SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavItem {
  label: string;
  href: string;
  icon: IconComponent;
}

export type ContactStatus = "lead" | "prospect" | "customer" | "churned";

export interface Contact {
  id: string;
  name: string;
  email: string;
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

export type DealStage = "qualified" | "proposal" | "negotiation" | "won" | "lost";

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  stage: DealStage;
  owner: string;
  expectedClose: string; // ISO date
}

/** A deal joined with the contact fields the UI needs to display it. */
export interface DealWithContact extends Deal {
  contact: Pick<Contact, "id" | "name">;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export interface PacePoint {
  day: number;
  date: string; // ISO date
  /** Cumulative revenue closed by end of day; null after today. */
  closed: number | null;
  /** Run-rate projection from today to month end; null before today. */
  projected: number | null;
  /** Where cumulative revenue needs to be to hit quota evenly. */
  pace: number;
}

export interface RevenuePace {
  monthLabel: string;
  daysInMonth: number;
  today: number;
  closed: number;
  quota: number;
  paceToDate: number;
  projected: number;
  points: PacePoint[];
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down" | "flat";
  /** Whether this direction is good news, which decides the delta color. */
  isGood: boolean;
  comparison: string;
  history: number[];
}

export interface StagePipeline {
  stage: DealStage;
  label: string;
  count: number;
  value: number;
  /** Likelihood a deal in this stage closes, used for the weighted forecast. */
  probability: number;
}

export interface UpcomingDeal extends DealWithContact {
  daysUntilClose: number;
}

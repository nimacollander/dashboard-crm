import {
  BriefcaseIcon,
  DollarIcon,
  TargetIcon,
  UserPlusIcon,
} from "@/components/icons";
import type { Contact, Metric } from "@/types";

export const METRICS: Metric[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$128,430",
    change: 12.4,
    trend: "up",
    icon: DollarIcon,
  },
  {
    id: "leads",
    label: "New Leads",
    value: "342",
    change: 8.1,
    trend: "up",
    icon: UserPlusIcon,
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: "24.8%",
    change: 1.6,
    trend: "down",
    icon: TargetIcon,
  },
  {
    id: "deals",
    label: "Active Deals",
    value: "57",
    change: 4.3,
    trend: "up",
    icon: BriefcaseIcon,
  },
];

export const RECENT_CONTACTS: Contact[] = [
  {
    id: "c_01",
    name: "Olivia Martin",
    email: "olivia@northwind.io",
    company: "Northwind",
    status: "customer",
    dealValue: 18500,
    lastContacted: "2026-10-16",
  },
  {
    id: "c_02",
    name: "Jackson Lee",
    email: "jackson@acmecorp.com",
    company: "Acme Corp",
    status: "prospect",
    dealValue: 9200,
    lastContacted: "2026-10-15",
  },
  {
    id: "c_03",
    name: "Isabella Nguyen",
    email: "isabella@globex.dev",
    company: "Globex",
    status: "lead",
    dealValue: 4000,
    lastContacted: "2026-10-14",
  },
  {
    id: "c_04",
    name: "William Kim",
    email: "will@initech.co",
    company: "Initech",
    status: "customer",
    dealValue: 26750,
    lastContacted: "2026-10-12",
  },
  {
    id: "c_05",
    name: "Sofia Davis",
    email: "sofia@umbrella.com",
    company: "Umbrella",
    status: "churned",
    dealValue: 0,
    lastContacted: "2026-10-09",
  },
];

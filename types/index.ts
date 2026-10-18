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
  company: string;
  status: ContactStatus;
  dealValue: number;
  lastContacted: string; // ISO date
}

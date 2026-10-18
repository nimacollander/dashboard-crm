import {
  BriefcaseIcon,
  DashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "@/components/icons";
import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: DashboardIcon },
  { label: "Contacts", href: "/contacts", icon: UsersIcon },
  { label: "Deals", href: "/deals", icon: BriefcaseIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
];

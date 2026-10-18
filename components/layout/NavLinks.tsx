"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";

interface NavLinksProps {
  onNavigate?: () => void;
}

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function NavLinks({ onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Icon
                className={`size-5 shrink-0 ${active ? "text-indigo-600" : "text-zinc-400"}`}
              />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Static fallback rendered while the pathname resolves (no active state). */
export function NavLinksFallback() {
  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600"
          >
            <Icon className="size-5 shrink-0 text-zinc-400" />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

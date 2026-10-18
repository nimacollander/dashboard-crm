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
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:outline-none ${
                active
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && (
                <span
                  className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent-400"
                  aria-hidden="true"
                />
              )}
              <Icon
                className={`size-[18px] shrink-0 ${active ? "text-accent-300" : "text-slate-500"}`}
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
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400"
          >
            <Icon className="size-[18px] shrink-0 text-slate-500" />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

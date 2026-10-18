import { Suspense } from "react";
import { CloseIcon } from "@/components/icons";
import { NavLinks, NavLinksFallback } from "@/components/layout/NavLinks";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-zinc-900/40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <span className="flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-900">
            <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              P
            </span>
            Pulse CRM
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 lg:hidden"
            aria-label="Close navigation"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4" aria-label="Main">
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks onNavigate={onClose} />
          </Suspense>
        </nav>

        <div className="border-t border-zinc-200 p-4 text-xs text-zinc-400">
          v0.1.0 · Demo data
        </div>
      </aside>
    </>
  );
}

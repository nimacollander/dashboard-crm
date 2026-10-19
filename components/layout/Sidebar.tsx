import { Suspense } from "react";
import { CloseIcon, LogoMarkIcon } from "@/components/icons";
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
        className={`fixed inset-0 z-30 bg-slate-950/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <span className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent-500 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
              <LogoMarkIcon className="size-[18px]" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-white">
              Sales CRM
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4" aria-label="Main">
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Workspace
          </p>
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks onNavigate={onClose} />
          </Suspense>
        </nav>

        <div className="m-3 flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-semibold text-accent-700">
            NC
          </span>
          <div className="min-w-0 text-xs">
            <p className="truncate font-medium text-white">Nima Collander</p>
            <p className="truncate text-slate-400">Admin · Demo data</p>
          </div>
        </div>
      </aside>
    </>
  );
}

import { BellIcon, MenuIcon, SearchIcon } from "@/components/icons";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon className="size-5" />
      </button>

      <span className="hidden text-sm font-medium text-zinc-500 sm:block">
        {title}
      </span>

      <div className="relative ml-auto w-full max-w-xs">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          placeholder="Search contacts, deals…"
          aria-label="Search"
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-3 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
        />
      </div>

      <button
        type="button"
        className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
        aria-label="Notifications"
      >
        <BellIcon className="size-5" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
      </button>

      <button
        type="button"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 ring-2 ring-white hover:ring-indigo-200"
        aria-label="Open profile menu"
      >
        NC
      </button>
    </header>
  );
}

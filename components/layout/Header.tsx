"use client";

import Form from "next/form";
import { useEffect, useRef } from "react";
import { BellIcon, MenuIcon, SearchIcon } from "@/components/icons";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K focuses the search box from anywhere in the app.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon className="size-5" />
      </button>

      {/* Submitting navigates client-side to /contacts?q=… */}
      <Form action="/contacts" role="search" className="relative w-full max-w-md">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={searchRef}
          type="search"
          name="q"
          placeholder="Search contacts…"
          aria-label="Search contacts"
          aria-keyshortcuts="Meta+K Control+K"
          className="peer w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-14 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent-500 focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:outline-none"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-400 peer-focus:hidden sm:block">
          ⌘K
        </kbd>
      </Form>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <BellIcon className="size-5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-accent-500 ring-2 ring-white" />
        </button>
        <span className="mx-2 hidden h-6 w-px bg-slate-200 sm:block" aria-hidden="true" />
        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-100 text-sm font-semibold text-accent-700 hover:ring-4 hover:ring-accent-50"
          aria-label="Open profile menu"
        >
          DA
        </button>
      </div>
    </header>
  );
}

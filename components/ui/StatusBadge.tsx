import type { ContactStatus } from "@/types";

const STATUS_STYLES: Record<ContactStatus, string> = {
  lead: "bg-sky-50 text-sky-700 ring-sky-600/20",
  prospect: "bg-amber-50 text-amber-700 ring-amber-600/20",
  customer: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  churned: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

interface StatusBadgeProps {
  status: ContactStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

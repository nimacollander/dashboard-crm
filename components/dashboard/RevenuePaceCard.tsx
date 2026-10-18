import type { ReactNode } from "react";
import { PaceChart } from "@/components/dashboard/PaceChart";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { RevenuePace } from "@/types";

interface RevenuePaceCardProps {
  data: RevenuePace;
}

export function RevenuePaceCard({ data }: RevenuePaceCardProps) {
  const { closed, quota, paceToDate, projected, today, daysInMonth } = data;
  const gap = closed - paceToDate;
  const isAhead = gap >= 0;
  const daysLeft = daysInMonth - today;
  const neededPerDay = daysLeft > 0 ? Math.max(quota - closed, 0) / daysLeft : 0;
  const attainment = Math.round((closed / quota) * 100);
  const pacePercent = Math.round((paceToDate / quota) * 100);
  const TrendIcon = isAhead ? ArrowUpRightIcon : ArrowDownRightIcon;

  return (
    <Card className="grid lg:grid-cols-[300px_1fr]">
      <section
        aria-labelledby="revenue-heading"
        className="flex flex-col border-b border-slate-100 p-6 lg:border-r lg:border-b-0"
      >
        <h2 id="revenue-heading" className="text-sm font-medium text-slate-500">
          Closed revenue
        </h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-900">
          {formatCurrency(closed)}
        </p>
        <p
          className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${
            isAhead ? "text-positive" : "text-negative"
          }`}
        >
          <TrendIcon className="size-4" />
          {formatCompactCurrency(Math.abs(gap))} {isAhead ? "ahead of" : "behind"} pace
        </p>

        <QuotaMeter attainment={attainment} pacePercent={pacePercent} quota={quota} />

        <dl className="mt-auto divide-y divide-slate-100 border-t border-slate-100 text-sm">
          <StatRow label="Projected">
            {formatCompactCurrency(projected)}
            <span className="ml-1.5 font-normal text-slate-500">
              {Math.round((projected / quota) * 100)}%
            </span>
          </StatRow>
          <StatRow label="Needed to hit quota">
            {formatCompactCurrency(neededPerDay)}
            <span className="ml-1 font-normal text-slate-500">/ day</span>
          </StatRow>
          <StatRow label="Days left">{daysLeft}</StatRow>
        </dl>
      </section>

      <section aria-label="Revenue pace" className="min-w-0 p-6">
        <PaceChart data={data} />
      </section>
    </Card>
  );
}

function StatRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 last:pb-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold whitespace-nowrap text-slate-900">{children}</dd>
    </div>
  );
}

interface QuotaMeterProps {
  attainment: number;
  pacePercent: number;
  quota: number;
}

/** A bullet meter: the fill is quota attained, the tick is where pace says you should be. */
function QuotaMeter({ attainment, pacePercent, quota }: QuotaMeterProps) {
  return (
    <div className="mt-6 mb-8">
      <div
        className="relative h-2 rounded-full bg-accent-100"
        role="meter"
        aria-label="Quota attained"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(attainment, 100)}
        aria-valuetext={`${attainment}% of quota, pace is ${pacePercent}%`}
      >
        <div
          className="h-full rounded-full bg-accent-500"
          style={{ width: `${Math.min(attainment, 100)}%` }}
        />
        <span
          className="absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 rounded-full bg-slate-700 ring-2 ring-white"
          style={{ left: `${Math.min(pacePercent, 100)}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>
          <span className="font-semibold text-slate-900">{attainment}%</span> of{" "}
          {formatCompactCurrency(quota)} quota
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-0.5 rounded-full bg-slate-700" aria-hidden="true" />
          Pace {pacePercent}%
        </span>
      </div>
    </div>
  );
}

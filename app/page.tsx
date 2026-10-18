import { ClosingSoon } from "@/components/dashboard/ClosingSoon";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { PipelineByStage } from "@/components/dashboard/PipelineByStage";
import { RecentContacts } from "@/components/dashboard/RecentContacts";
import { RevenuePaceCard } from "@/components/dashboard/RevenuePaceCard";
import { getDashboardData } from "@/lib/dashboard";

export default async function DashboardPage() {
  const { revenue, kpis, pipeline, closingSoon, recentContacts } =
    await getDashboardData();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-wider text-accent-600 uppercase">
          {revenue.monthLabel} · Day {revenue.today} of {revenue.daysInMonth}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-slate-900">
          Sales overview
        </h1>
      </header>

      <RevenuePaceCard data={revenue} />
      <KpiStrip kpis={kpis} />

      <div className="grid gap-6 lg:grid-cols-2">
        <PipelineByStage stages={pipeline} />
        <ClosingSoon deals={closingSoon} />
      </div>

      <RecentContacts contacts={recentContacts} />
    </div>
  );
}

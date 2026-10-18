import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentContacts } from "@/components/dashboard/RecentContacts";
import { getRecentContacts } from "@/lib/contacts";
import { METRICS } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here&apos;s what&apos;s happening with your pipeline this month.
        </p>
      </div>

      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <RecentContacts contacts={getRecentContacts(5)} />
    </div>
  );
}

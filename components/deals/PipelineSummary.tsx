import { Card } from "@/components/ui/Card";
import { isOpenDeal, sumDealValues } from "@/lib/deal-stages";
import { formatCurrency } from "@/lib/format";
import type { Deal } from "@/types";

interface PipelineSummaryProps {
  deals: Deal[];
}

export function PipelineSummary({ deals }: PipelineSummaryProps) {
  const open = deals.filter(isOpenDeal);
  const won = deals.filter((deal) => deal.stage === "won");
  const closedCount = won.length + deals.filter((deal) => deal.stage === "lost").length;
  const winRate = closedCount > 0 ? Math.round((won.length / closedCount) * 100) : 0;

  const stats = [
    { label: "Open pipeline", value: formatCurrency(sumDealValues(open)), detail: `${open.length} open deals` },
    { label: "Closed won", value: formatCurrency(sumDealValues(won)), detail: `${won.length} deals` },
    { label: "Win rate", value: `${winRate}%`, detail: `of ${closedCount} closed deals` },
  ];

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="px-5 py-4">
          <dt className="text-sm font-medium text-zinc-500">{stat.label}</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">
            {stat.value}
          </dd>
          <dd className="mt-0.5 text-xs text-zinc-500">{stat.detail}</dd>
        </Card>
      ))}
    </dl>
  );
}

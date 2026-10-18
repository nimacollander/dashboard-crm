import { ArrowDownRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import type { Metric } from "@/types";

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const { label, value, change, trend, icon: Icon } = metric;
  const isUp = trend === "up";
  const TrendIcon = isUp ? ArrowUpRightIcon : ArrowDownRightIcon;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">
        {value}
      </p>
      <p className="mt-1 flex items-center gap-1 text-xs">
        <span
          className={`inline-flex items-center gap-0.5 font-medium ${
            isUp ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          <TrendIcon className="size-3.5" />
          {change}%
        </span>
        <span className="text-zinc-500">vs last month</span>
      </p>
    </Card>
  );
}

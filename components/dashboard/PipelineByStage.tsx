import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { formatCompactCurrency } from "@/lib/format";
import type { StagePipeline } from "@/types";

interface PipelineByStageProps {
  stages: StagePipeline[];
}

export function PipelineByStage({ stages }: PipelineByStageProps) {
  const total = stages.reduce((sum, stage) => sum + stage.value, 0);
  const count = stages.reduce((sum, stage) => sum + stage.count, 0);
  const max = Math.max(...stages.map((stage) => stage.value), 1);
  const weighted = stages.reduce((sum, stage) => sum + stage.value * stage.probability, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Open pipeline"
        description={`${formatCompactCurrency(total)} across ${count} deals`}
        action={
          <Link href="/deals" className="text-sm font-medium text-accent-600 hover:text-accent-700">
            Open board
          </Link>
        }
      />
      <ul className="flex flex-1 flex-col justify-center gap-1 p-3">
        {stages.map((stage) => {
          const share = total ? Math.round((stage.value / total) * 100) : 0;
          const average = stage.count ? stage.value / stage.count : 0;
          return (
            <li key={stage.stage}>
              <Link
                href="/deals"
                className="group relative block rounded-lg px-3 py-3 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:outline-none"
              >
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-900">{stage.label}</span>
                  <span className="text-slate-500">
                    <span className="font-semibold text-slate-900">
                      {formatCompactCurrency(stage.value)}
                    </span>{" "}
                    · {stage.count} {stage.count === 1 ? "deal" : "deals"}
                  </span>
                </div>
                {/* Single-series bars: one hue, magnitude carried by length. */}
                <div className="mt-2 h-2.5" aria-hidden="true">
                  <div
                    className="h-full rounded-r-[4px] bg-accent-500 transition-colors group-hover:bg-accent-600"
                    style={{ width: `${Math.max((stage.value / max) * 100, 2)}%` }}
                  />
                </div>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute top-1 right-3 z-10 -translate-y-full rounded-md bg-slate-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="font-semibold">{share}%</span> of pipeline · avg.{" "}
                  {formatCompactCurrency(average)} per deal
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm font-medium text-slate-900">Weighted forecast</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {stages
              .map((stage) => `${stage.label} ${Math.round(stage.probability * 100)}%`)
              .join(" · ")}
          </p>
        </div>
        <p className="text-lg font-semibold text-slate-900">
          {formatCompactCurrency(weighted)}
        </p>
      </div>
    </Card>
  );
}

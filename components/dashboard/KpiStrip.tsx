import { ArrowDownRightIcon, ArrowUpRightIcon } from "@/components/icons";
import type { Kpi } from "@/types";

interface KpiStripProps {
  kpis: Kpi[];
}

export function KpiStrip({ kpis }: KpiStripProps) {
  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-200/80 bg-slate-200/80 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:grid-cols-2 xl:grid-cols-4"
    >
      {kpis.map((kpi) => (
        <KpiTile key={kpi.id} kpi={kpi} />
      ))}
    </section>
  );
}

function KpiTile({ kpi }: { kpi: Kpi }) {
  const TrendIcon =
    kpi.direction === "up"
      ? ArrowUpRightIcon
      : kpi.direction === "down"
        ? ArrowDownRightIcon
        : null;
  const deltaColor =
    kpi.direction === "flat"
      ? "text-slate-500"
      : kpi.isGood
        ? "text-positive"
        : "text-negative";

  return (
    <div className="flex items-end justify-between gap-4 bg-white px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{kpi.label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          {kpi.value}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs whitespace-nowrap">
          <span className={`inline-flex items-center gap-0.5 font-medium ${deltaColor}`}>
            {TrendIcon && <TrendIcon className="size-3.5" />}
            {kpi.direction !== "flat" && (
              <span className="sr-only">{kpi.direction === "up" ? "Up" : "Down"}</span>
            )}
            {kpi.delta}
          </span>
          <span className="text-slate-500">{kpi.comparison}</span>
        </p>
      </div>
      <Sparkline values={kpi.history} label={kpi.label} />
    </div>
  );
}

const SPARK_WIDTH = 96;
const SPARK_HEIGHT = 36;
const SPARK_PAD = 5;

/**
 * Twelve weekly points: history in a recessive gray, the current week in the
 * accent so the eye lands on "now".
 */
function Sparkline({ values, label }: { values: number[]; label: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((value, i) => [
    SPARK_PAD + (i / (values.length - 1)) * (SPARK_WIDTH - SPARK_PAD * 2),
    SPARK_PAD + (1 - (value - min) / range) * (SPARK_HEIGHT - SPARK_PAD * 2),
  ]);
  const toPath = (pts: number[][]) =>
    pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      width={SPARK_WIDTH}
      height={SPARK_HEIGHT}
      className="shrink-0 overflow-visible"
      role="img"
      aria-label={`${label}, last ${values.length} weeks`}
    >
      <path
        d={toPath(points.slice(0, -1))}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={toPath(points.slice(-2))}
        fill="none"
        stroke="#2a78d6"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r={4} fill="#2a78d6" stroke="#ffffff" strokeWidth={2} />
    </svg>
  );
}

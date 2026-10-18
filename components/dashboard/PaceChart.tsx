"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { formatCompactCurrency, formatCurrency, formatShortDate } from "@/lib/format";
import type { PacePoint, RevenuePace } from "@/types";

const HEIGHT = 288;
const MARGIN = { top: 28, right: 112, bottom: 32, left: 48 };

// Validated pair (CVD ΔE 17.6, normal-vision ΔE 18.0, both ≥ 3:1 on white).
// "Projected" reuses the closed-revenue blue on purpose: it is the same
// measure carried forward, told apart by its dash and by sitting after today.
const COLORS = {
  closed: "#2a78d6",
  pace: "#475569",
  grid: "#e2e8f0",
  axis: "#cbd5e1",
  surface: "#ffffff",
};

/** Clean axis ticks (0, 50K, 100K…) with a top tick at or above `max`. */
function niceTicks(max: number, target = 5): number[] {
  const rough = max / target;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ??
    10 * magnitude;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

interface PaceChartProps {
  data: RevenuePace;
}

export function PaceChart({ data }: PaceChartProps) {
  const { points, daysInMonth, today, quota } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [view, setView] = useState<"chart" | "table">("chart");
  const descriptionId = useId();

  // Render at the container's real pixel width so text and strokes never stretch.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [view]);

  const ticks = niceTicks(Math.max(data.projected, quota));
  const yMax = ticks[ticks.length - 1];
  const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const x = (day: number) => MARGIN.left + ((day - 1) / (daysInMonth - 1)) * innerWidth;
  const y = (value: number) => MARGIN.top + innerHeight * (1 - value / yMax);

  const toPath = (pairs: [number, number][]) =>
    pairs
      .map(([day, value], i) => `${i ? "L" : "M"}${x(day).toFixed(1)},${y(value).toFixed(1)}`)
      .join("");

  const closedPairs = points.flatMap((p): [number, number][] =>
    p.closed === null ? [] : [[p.day, p.closed]],
  );
  const projectedPairs = points.flatMap((p): [number, number][] =>
    p.projected === null ? [] : [[p.day, p.projected]],
  );
  const closedPath = toPath(closedPairs);
  const areaPath = `${closedPath}L${x(today)},${y(0)}L${x(1)},${y(0)}Z`;
  const pacePath = toPath([
    [1, points[0].pace],
    [daysInMonth, quota],
  ]);

  const active: PacePoint | null =
    activeDay === null ? null : (points[activeDay - 1] ?? null);
  // Weekly ticks when there's room; first, middle and last week on phones.
  const xTicks = (innerWidth < 320 ? [1, 15, 29] : [1, 8, 15, 22, 29]).filter(
    (day) => day <= daysInMonth,
  );

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!innerWidth) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left - MARGIN.left) / innerWidth;
    setActiveDay(clamp(Math.round(ratio * (daysInMonth - 1)) + 1, 1, daysInMonth));
  }

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };
    if (event.key === "Home") setActiveDay(1);
    else if (event.key === "End") setActiveDay(daysInMonth);
    else if (event.key in steps) {
      setActiveDay((day) => clamp((day ?? today) + steps[event.key], 1, daysInMonth));
    } else return;
    event.preventDefault();
  }

  const tooltipLeft = active ? x(active.day) : 0;
  const flipTooltip = tooltipLeft > width - 200;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
          <LegendItem label="Closed">
            <line x1="0" y1="4" x2="16" y2="4" stroke={COLORS.closed} strokeWidth="2" />
          </LegendItem>
          <LegendItem label="Projected">
            <line x1="0" y1="4" x2="16" y2="4" stroke={COLORS.closed} strokeWidth="2" strokeDasharray="4 3" />
          </LegendItem>
          <LegendItem label="Quota pace">
            <line x1="0" y1="4" x2="16" y2="4" stroke={COLORS.pace} strokeWidth="2" />
          </LegendItem>
        </ul>
        <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium" role="group" aria-label="Display as">
          {(["chart", "table"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              aria-pressed={view === option}
              className={`rounded-md px-2.5 py-1 capitalize transition-colors ${
                view === option
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {view === "table" ? (
        <PaceTable points={points} />
      ) : (
        <div ref={containerRef} className="relative" style={{ height: HEIGHT }}>
          <p id={descriptionId} className="sr-only">
            Cumulative revenue for {data.monthLabel}. {formatCurrency(data.closed)} closed
            by day {today}, against a quota pace of {formatCurrency(data.paceToDate)}.
            Projected to finish at {formatCurrency(data.projected)} against a{" "}
            {formatCurrency(quota)} quota. Use the left and right arrow keys to read
            each day.
          </p>

          {width > 0 && (
            <svg
              width={width}
              height={HEIGHT}
              className="block touch-pan-y overflow-visible focus-visible:outline-none"
              tabIndex={0}
              role="group"
              aria-label="Revenue pace chart"
              aria-describedby={descriptionId}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setActiveDay(null)}
              onFocus={() => setActiveDay((day) => day ?? today)}
              onBlur={() => setActiveDay(null)}
              onKeyDown={handleKeyDown}
            >
              {/* Gridlines + y-axis labels */}
              {ticks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={MARGIN.left}
                    x2={MARGIN.left + innerWidth}
                    y1={y(tick)}
                    y2={y(tick)}
                    stroke={tick === 0 ? COLORS.axis : COLORS.grid}
                  />
                  <text
                    x={MARGIN.left - 10}
                    y={y(tick)}
                    dy="0.32em"
                    textAnchor="end"
                    className="fill-slate-500 text-[11px] tabular-nums"
                  >
                    {tick === 0 ? "0" : formatCompactCurrency(tick)}
                  </text>
                </g>
              ))}

              {/* X-axis labels */}
              {xTicks.map((day) => (
                <text
                  key={day}
                  x={x(day)}
                  y={HEIGHT - 10}
                  textAnchor="middle"
                  className="fill-slate-500 text-[11px]"
                >
                  {formatShortDate(points[day - 1].date)}
                </text>
              ))}

              {/* Today marker */}
              <line
                x1={x(today)}
                x2={x(today)}
                y1={MARGIN.top - 6}
                y2={MARGIN.top + innerHeight}
                stroke={COLORS.axis}
              />
              <text
                x={x(today)}
                y={MARGIN.top - 12}
                textAnchor="middle"
                className="fill-slate-500 text-[11px] font-medium"
              >
                Today
              </text>

              {/* Series */}
              <path d={pacePath} fill="none" stroke={COLORS.pace} strokeWidth={2} strokeLinecap="round" />
              <path d={areaPath} fill={COLORS.closed} fillOpacity={0.1} className="animate-fade-in-late" />
              <path
                d={toPath(projectedPairs)}
                fill="none"
                stroke={COLORS.closed}
                strokeWidth={2}
                strokeDasharray="5 4"
                strokeLinecap="round"
                className="animate-fade-in-late"
              />
              <path
                d={closedPath}
                pathLength={1}
                fill="none"
                stroke={COLORS.closed}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="animate-draw-line"
              />

              {/* Direct labels: today's total and both month-end values */}
              <circle
                cx={x(today)}
                cy={y(data.closed)}
                r={4.5}
                fill={COLORS.closed}
                stroke={COLORS.surface}
                strokeWidth={2}
              />
              <text
                x={x(today) - 10}
                y={y(data.closed) - 10}
                textAnchor="end"
                className="fill-slate-900 text-xs font-semibold"
              >
                {formatCompactCurrency(data.closed)}
              </text>
              <EndLabel
                x={x(daysInMonth) + 10}
                y={y(data.projected)}
                label="Projected"
                value={formatCompactCurrency(data.projected)}
              />
              <EndLabel
                x={x(daysInMonth) + 10}
                y={y(quota)}
                label="Quota"
                value={formatCompactCurrency(quota)}
              />

              {/* Crosshair */}
              {active && (
                <g pointerEvents="none">
                  <line
                    x1={x(active.day)}
                    x2={x(active.day)}
                    y1={MARGIN.top}
                    y2={MARGIN.top + innerHeight}
                    stroke="#94a3b8"
                  />
                  {[
                    { value: active.closed, color: COLORS.closed },
                    { value: active.closed === null ? active.projected : null, color: COLORS.closed },
                    { value: active.pace, color: COLORS.pace },
                  ].map(
                    (marker, i) =>
                      marker.value !== null && (
                        <circle
                          key={i}
                          cx={x(active.day)}
                          cy={y(marker.value)}
                          r={4}
                          fill={marker.color}
                          stroke={COLORS.surface}
                          strokeWidth={2}
                        />
                      ),
                  )}
                </g>
              )}

              {/* Full-height hit area so the pointer only needs the right date */}
              <rect
                x={MARGIN.left}
                y={MARGIN.top}
                width={innerWidth}
                height={innerHeight}
                fill="transparent"
              />
            </svg>
          )}

          {active && (
            <div
              className="pointer-events-none absolute top-6 z-10 w-44 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-lg"
              style={{
                left: tooltipLeft,
                transform: flipTooltip ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
              }}
              aria-live="polite"
            >
              <p className="mb-1.5 font-medium text-slate-500">
                {formatShortDate(active.date)}
                {active.day === today && " · Today"}
              </p>
              <dl className="space-y-1">
                {active.closed !== null && (
                  <TooltipRow color={COLORS.closed} label="Closed" value={active.closed} />
                )}
                {active.projected !== null && active.day !== today && (
                  <TooltipRow color={COLORS.closed} dashed label="Projected" value={active.projected} />
                )}
                <TooltipRow color={COLORS.pace} label="Quota pace" value={active.pace} />
              </dl>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LegendItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="flex items-center gap-1.5">
      <svg width="16" height="8" aria-hidden="true">
        {children}
      </svg>
      {label}
    </li>
  );
}

function EndLabel({ x, y, label, value }: { x: number; y: number; label: string; value: string }) {
  return (
    <text x={x} y={y} dy="0.32em" className="text-xs">
      <tspan className="fill-slate-900 font-semibold">{value}</tspan>
      <tspan className="fill-slate-500" dx="4">
        {label}
      </tspan>
    </text>
  );
}

interface TooltipRowProps {
  color: string;
  label: string;
  value: number;
  dashed?: boolean;
}

function TooltipRow({ color, label, value, dashed }: TooltipRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-1.5 text-slate-500">
        <svg width="12" height="4" aria-hidden="true">
          <line x1="0" y1="2" x2="12" y2="2" stroke={color} strokeWidth="2" strokeDasharray={dashed ? "3 2" : undefined} />
        </svg>
        {label}
      </dt>
      <dd className="font-semibold text-slate-900 tabular-nums">{formatCurrency(value)}</dd>
    </div>
  );
}

function PaceTable({ points }: { points: PacePoint[] }) {
  return (
    <div className="max-h-72 overflow-auto rounded-lg border border-slate-100">
      <table className="w-full text-right text-xs tabular-nums">
        <thead className="sticky top-0 bg-slate-50 text-slate-500">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-medium">Date</th>
            <th scope="col" className="px-3 py-2 font-medium">Closed</th>
            <th scope="col" className="px-3 py-2 font-medium">Projected</th>
            <th scope="col" className="px-3 py-2 font-medium">Quota pace</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {points.map((point) => (
            <tr key={point.day}>
              <th scope="row" className="px-3 py-1.5 text-left font-normal text-slate-500">
                {formatShortDate(point.date)}
              </th>
              <td className="px-3 py-1.5">{point.closed === null ? "—" : formatCurrency(point.closed)}</td>
              <td className="px-3 py-1.5">{point.projected === null ? "—" : formatCurrency(point.projected)}</td>
              <td className="px-3 py-1.5">{formatCurrency(point.pace)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useDroppable } from "@dnd-kit/core";
import { DraggableDeal } from "@/components/deals/DraggableDeal";
import { sumDealValues, type StageConfig } from "@/lib/deal-stages";
import { formatCurrency } from "@/lib/format";
import type { DealWithContact } from "@/types";

interface PipelineColumnProps {
  stage: StageConfig;
  deals: DealWithContact[];
}

export function PipelineColumn({ stage, deals }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const headingId = `stage-${stage.id}-heading`;

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={`flex w-72 shrink-0 flex-col rounded-xl border p-3 transition-colors xl:w-auto xl:min-w-0 xl:flex-1 ${
        isOver
          ? "border-accent-300 bg-accent-50/60"
          : "border-transparent bg-slate-100/70"
      }`}
    >
      <header className="mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${stage.dotClass}`} aria-hidden="true" />
          <h2 id={headingId} className="text-sm font-semibold text-slate-900">
            {stage.label}
          </h2>
          <span className="rounded-full bg-white px-1.5 text-xs font-medium text-slate-500 tabular-nums">
            {deals.length}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 tabular-nums">
          {formatCurrency(sumDealValues(deals))}
        </p>
      </header>

      {deals.length > 0 ? (
        <ul className="flex flex-1 flex-col gap-2.5">
          {deals.map((deal) => (
            <DraggableDeal key={deal.id} deal={deal} />
          ))}
        </ul>
      ) : (
        <p className="flex min-h-24 flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-xs text-slate-400">
          Drop deals here
        </p>
      )}
    </section>
  );
}

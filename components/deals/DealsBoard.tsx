"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
  type KeyboardCoordinateGetter,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { moveDealAction } from "@/app/deals/actions";
import { DealCard } from "@/components/deals/DealCard";
import { PipelineColumn } from "@/components/deals/PipelineColumn";
import { PipelineSummary } from "@/components/deals/PipelineSummary";
import { CloseIcon } from "@/components/icons";
import { DEAL_STAGES, isDealStage, STAGE_LABELS } from "@/lib/deal-stages";
import type { DealStage, DealWithContact } from "@/types";

interface DealMove {
  dealId: string;
  stage: DealStage;
}

/**
 * Arrow keys jump the card a whole column left or right, instead of
 * dnd-kit's default of nudging it a few pixels per key press.
 */
const columnKeyboardCoordinates: KeyboardCoordinateGetter = (
  event,
  { context: { collisionRect, droppableRects }, currentCoordinates },
) => {
  const direction =
    event.code === "ArrowRight" ? 1 : event.code === "ArrowLeft" ? -1 : 0;
  if (!direction || !collisionRect) return undefined;

  event.preventDefault();
  const columns = [...droppableRects.values()].sort((a, b) => a.left - b.left);
  const cardCenter = collisionRect.left + collisionRect.width / 2;
  const currentIndex = columns.findIndex(
    (rect) => cardCenter >= rect.left && cardCenter <= rect.right,
  );
  const target = columns[currentIndex + direction];
  if (!target) return currentCoordinates;

  return {
    x: currentCoordinates.x + (target.left + target.width / 2 - cardCenter),
    y: currentCoordinates.y,
  };
};

function groupByStage(deals: DealWithContact[]): Record<DealStage, DealWithContact[]> {
  const groups = Object.fromEntries(
    DEAL_STAGES.map((stage) => [stage.id, [] as DealWithContact[]]),
  ) as Record<DealStage, DealWithContact[]>;
  for (const deal of deals) groups[deal.stage].push(deal);
  return groups;
}

function stageLabel(id: UniqueIdentifier | undefined): string | null {
  return isDealStage(id) ? STAGE_LABELS[id] : null;
}

interface DealsBoardProps {
  deals: DealWithContact[];
}

export function DealsBoard({ deals }: DealsBoardProps) {
  // Moves show instantly; once the Server Action responds, `deals` is replaced
  // by fresh server data. If the action fails, React drops the optimistic move
  // and the card snaps back on its own.
  const [optimisticDeals, applyMove] = useOptimistic(
    deals,
    (current, { dealId, stage }: DealMove) =>
      current.map((deal) => (deal.id === dealId ? { ...deal, stage } : deal)),
  );
  const [, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    // Small thresholds so clicks on the contact link still navigate,
    // and touch users can scroll the board without picking up a card.
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: columnKeyboardCoordinates }),
  );

  const dealsByStage = useMemo(() => groupByStage(optimisticDeals), [optimisticDeals]);
  const findDeal = (id: UniqueIdentifier | null) =>
    optimisticDeals.find((deal) => deal.id === id);
  const activeDeal = findDeal(activeId);

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `Picked up ${findDeal(active.id)?.title}. Use the left and right arrow keys to move between stages.`,
    onDragOver: ({ over }) =>
      over ? `Over ${stageLabel(over.id)}.` : "Not over a stage.",
    onDragEnd: ({ active, over }) =>
      over
        ? `Moved ${findDeal(active.id)?.title} to ${stageLabel(over.id)}.`
        : `Dropped ${findDeal(active.id)?.title}. It was not moved.`,
    onDragCancel: ({ active }) =>
      `Cancelled. ${findDeal(active.id)?.title} was not moved.`,
  };

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    const deal = findDeal(active.id);
    const stage = over?.id;
    if (!deal || !isDealStage(stage) || deal.stage === stage) return;

    setError(null);
    startTransition(async () => {
      applyMove({ dealId: deal.id, stage });
      try {
        const result = await moveDealAction(deal.id, stage);
        if (!result.ok) setError(result.error);
      } catch {
        setError("Couldn't save that change. Check your connection and try again.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <PipelineSummary deals={optimisticDeals} />

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="rounded p-0.5 hover:bg-rose-100"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      )}

      {/* A stable `id` keeps dnd-kit's generated ARIA ids identical on server
          and client, which avoids hydration mismatch warnings. */}
      <DndContext
        id="deals-board"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
        accessibility={{
          announcements,
          screenReaderInstructions: {
            draggable:
              "To move a deal, press space or enter to pick it up, use the left and right arrow keys to choose a stage, then press space or enter to drop it. Press escape to cancel.",
          },
        }}
      >
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {DEAL_STAGES.map((stage) => (
            <PipelineColumn key={stage.id} stage={stage} deals={dealsByStage[stage.id]} />
          ))}
        </div>

        <DragOverlay>
          {activeDeal && (
            <DealCard
              deal={activeDeal}
              className="rotate-2 cursor-grabbing shadow-lg ring-2 ring-indigo-500/30"
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

"use client";

import { useDraggable } from "@dnd-kit/core";
import type { KeyboardEventHandler } from "react";
import { GripIcon } from "@/components/icons";
import { DealCard } from "@/components/deals/DealCard";
import type { DealWithContact } from "@/types";

interface DraggableDealProps {
  deal: DealWithContact;
}

export function DraggableDeal({ deal }: DraggableDealProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
  } = useDraggable({ id: deal.id });

  // Mouse and touch can drag from anywhere on the card, but keyboard dragging
  // only starts from the grip button. That way pressing Enter on the contact
  // link follows the link instead of picking up the card.
  const { onKeyDown, ...pointerListeners } = listeners ?? {};
  // dnd-kit types its listeners as plain `Function`s.
  const handleKeyDown = onKeyDown as KeyboardEventHandler<HTMLButtonElement> | undefined;

  return (
    <li ref={setNodeRef} {...pointerListeners} className="touch-manipulation">
      <DealCard
        deal={deal}
        className={`cursor-grab transition-opacity ${isDragging ? "opacity-40" : ""}`}
        handle={
          <button
            ref={setActivatorNodeRef}
            type="button"
            {...attributes}
            onKeyDown={handleKeyDown}
            aria-label={`Move ${deal.title}`}
            className="-mt-0.5 -mr-1 shrink-0 cursor-grab rounded p-0.5 text-zinc-300 hover:bg-zinc-100 hover:text-zinc-500 focus-visible:text-zinc-600 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <GripIcon className="size-4" />
          </button>
        }
      />
    </li>
  );
}

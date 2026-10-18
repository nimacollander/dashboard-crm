import type { Deal, DealStage } from "@/types";

/** Client-safe stage config, shared by the board and server code. */

export interface StageConfig {
  id: DealStage;
  label: string;
  dotClass: string;
}

export const DEAL_STAGES: readonly StageConfig[] = [
  { id: "qualified", label: "Qualified", dotClass: "bg-sky-500" },
  { id: "proposal", label: "Proposal", dotClass: "bg-violet-500" },
  { id: "negotiation", label: "Negotiation", dotClass: "bg-amber-500" },
  { id: "won", label: "Won", dotClass: "bg-emerald-500" },
  { id: "lost", label: "Lost", dotClass: "bg-zinc-400" },
];

export const STAGE_LABELS = Object.fromEntries(
  DEAL_STAGES.map((stage) => [stage.id, stage.label]),
) as Record<DealStage, string>;

export function isDealStage(value: unknown): value is DealStage {
  return DEAL_STAGES.some((stage) => stage.id === value);
}

export function isOpenDeal(deal: Pick<Deal, "stage">): boolean {
  return deal.stage !== "won" && deal.stage !== "lost";
}

export function sumDealValues(deals: Pick<Deal, "value">[]): number {
  return deals.reduce((total, deal) => total + deal.value, 0);
}

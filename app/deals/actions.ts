"use server";

import { updateTag } from "next/cache";
import { isDealStage } from "@/lib/deal-stages";
import { DEALS_CACHE_TAG, updateDealStage } from "@/lib/deals";
import type { ActionResult } from "@/types";

/**
 * Moves a deal to a new pipeline stage.
 *
 * Server Actions are public POST endpoints, so arguments are validated here
 * rather than trusted from the client. A real app would also check that the
 * signed-in user is allowed to edit this deal.
 */
export async function moveDealAction(
  dealId: unknown,
  stage: unknown,
): Promise<ActionResult> {
  if (typeof dealId !== "string" || !isDealStage(stage)) {
    return { ok: false, error: "Invalid request." };
  }

  const deal = await updateDealStage(dealId, stage);
  if (!deal) {
    return { ok: false, error: "That deal no longer exists." };
  }

  // Expire every cached read of deals (board, dashboard, contact pages) so
  // the response to this action already contains the updated data.
  updateTag(DEALS_CACHE_TAG);

  return { ok: true };
}

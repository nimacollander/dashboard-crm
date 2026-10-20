import { cacheTag } from "next/cache";
import { getContactById } from "@/lib/contacts";
import { DEALS } from "@/lib/mock-data";
import type { Deal, DealStage, DealWithContact } from "@/types";

/**
 * Server-side data access for deals.
 *
 * Deals live in an in-memory array, so moves last until the server restarts.
 * Swap these function bodies for database calls to make changes permanent;
 * the cache tag and the Server Action that invalidates it stay the same.
 */

export const DEALS_CACHE_TAG = "deals";

const store: Deal[] = DEALS.map((deal) => ({ ...deal }));

function withContact(deal: Deal): DealWithContact {
  const contact = getContactById(deal.contactId);
  return {
    ...deal,
    contact: {
      id: deal.contactId,
      name: contact?.name ?? "Unknown contact",
    },
  };
}

/** Sorted by expected close date so each board column reads soonest-first. */
export async function getDeals(): Promise<DealWithContact[]> {
  "use cache";
  cacheTag(DEALS_CACHE_TAG);

  return store
    .map(withContact)
    .sort((a, b) => a.expectedClose.localeCompare(b.expectedClose));
}

export async function getDealsForContact(
  contactId: string,
): Promise<DealWithContact[]> {
  const deals = await getDeals();
  return deals.filter((deal) => deal.contactId === contactId);
}

export async function updateDealStage(
  dealId: string,
  stage: DealStage,
): Promise<Deal | undefined> {
  const deal = store.find((item) => item.id === dealId);
  if (deal) deal.stage = stage;
  return deal;
}

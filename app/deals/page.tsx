import type { Metadata } from "next";
import { DealsBoard } from "@/components/deals/DealsBoard";
import { getDeals } from "@/lib/deals";

export const metadata: Metadata = { title: "Deals" };

export default async function DealsPage() {
  // getDeals() is cached and tagged, so this page is prerendered and only
  // re-rendered after moveDealAction invalidates the "deals" tag.
  const deals = await getDeals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight text-slate-900">
          Deals
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Drag a deal between stages to update it.
        </p>
      </div>

      <DealsBoard deals={deals} />
    </div>
  );
}

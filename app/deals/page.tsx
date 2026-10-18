import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Deals" };

export default function DealsPage() {
  return (
    <PagePlaceholder
      title="Deals"
      description="Track opportunities from first touch to closed-won."
    />
  );
}

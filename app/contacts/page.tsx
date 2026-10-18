import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Contacts" };

export default function ContactsPage() {
  return (
    <PagePlaceholder
      title="Contacts"
      description="Manage every person and company in your pipeline."
    />
  );
}

import Link from "next/link";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { Card, CardHeader } from "@/components/ui/Card";
import type { Contact } from "@/types";

interface RecentContactsProps {
  contacts: Contact[];
}

export function RecentContacts({ contacts }: RecentContactsProps) {
  return (
    <Card>
      <CardHeader
        title="Recent contacts"
        description="People your team spoke to most recently"
        action={
          <Link
            href="/contacts"
            className="text-sm font-medium text-accent-600 hover:text-accent-700"
          >
            View all
          </Link>
        }
      />

      {contacts.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-slate-500">
          No contacts yet.
        </p>
      ) : (
        <ContactsTable contacts={contacts} />
      )}
    </Card>
  );
}

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
        title="Recent Contacts"
        description="The latest people your team has been in touch with."
        action={
          <Link
            href="/contacts"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all
          </Link>
        }
      />

      {contacts.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-zinc-500">
          No contacts yet.
        </p>
      ) : (
        <ContactsTable contacts={contacts} />
      )}
    </Card>
  );
}

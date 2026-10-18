import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate, getInitials } from "@/lib/format";
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
              <tr>
                <th scope="col" className="px-5 py-3">Name</th>
                <th scope="col" className="px-5 py-3">Company</th>
                <th scope="col" className="px-5 py-3">Status</th>
                <th scope="col" className="px-5 py-3 text-right">Deal Value</th>
                <th scope="col" className="px-5 py-3 text-right">Last Contacted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-zinc-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                        {getInitials(contact.name)}
                      </span>
                      <div>
                        <p className="font-medium text-zinc-900">{contact.name}</p>
                        <p className="text-xs text-zinc-500">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-zinc-600">{contact.company}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={contact.status} />
                  </td>
                  <td className="px-5 py-3 text-right text-zinc-900 tabular-nums">
                    {formatCurrency(contact.dealValue)}
                  </td>
                  <td className="px-5 py-3 text-right text-zinc-500 tabular-nums">
                    {formatDate(contact.lastContacted)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

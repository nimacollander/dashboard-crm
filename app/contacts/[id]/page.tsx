import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ContactAvatar } from "@/components/contacts/ContactAvatar";
import {
  ArrowLeftIcon,
  BuildingIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAllContacts, getContactById } from "@/lib/contacts";
import { formatCurrency, formatDate } from "@/lib/format";
import type { IconComponent } from "@/types";

// Prerender every known contact at build time. With Cache Components this
// must return at least one entry; unknown IDs fall through to notFound().
export function generateStaticParams() {
  return getAllContacts().map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/contacts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const contact = getContactById(id);
  return { title: contact?.name ?? "Contact not found" };
}

export default async function ContactPage({ params }: PageProps<"/contacts/[id]">) {
  const { id } = await params;
  const contact = getContactById(id);
  if (!contact) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/contacts"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeftIcon className="size-4" />
        All contacts
      </Link>

      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <ContactAvatar name={contact.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {contact.name}
            </h1>
            <StatusBadge status={contact.status} />
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {contact.jobTitle} at {contact.company}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            <MailIcon className="size-4" />
            Email
          </a>
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
          >
            <PhoneIcon className="size-4" />
            Call
          </a>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Contact details" />
          <dl className="divide-y divide-zinc-100">
            <DetailRow icon={MailIcon} label="Email">
              <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:underline">
                {contact.email}
              </a>
            </DetailRow>
            <DetailRow icon={PhoneIcon} label="Phone">
              {contact.phone}
            </DetailRow>
            <DetailRow icon={BuildingIcon} label="Company">
              {contact.company}
            </DetailRow>
            <DetailRow icon={MapPinIcon} label="Location">
              {contact.location}
            </DetailRow>
          </dl>
        </Card>

        <Card>
          <CardHeader title="Deal summary" />
          <dl className="space-y-4 p-5">
            <div>
              <dt className="text-xs font-medium text-zinc-500">Deal value</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                {formatCurrency(contact.dealValue)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-500">Last contacted</dt>
              <dd className="mt-1 text-sm text-zinc-900">
                {formatDate(contact.lastContacted)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-500">Added to CRM</dt>
              <dd className="mt-1 text-sm text-zinc-900">
                {formatDate(contact.createdAt)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}

interface DetailRowProps {
  icon: IconComponent;
  label: string;
  children: ReactNode;
}

function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 text-sm">
      <Icon className="size-4 shrink-0 text-zinc-400" />
      <dt className="w-24 shrink-0 text-zinc-500">{label}</dt>
      <dd className="min-w-0 truncate text-zinc-900">{children}</dd>
    </div>
  );
}

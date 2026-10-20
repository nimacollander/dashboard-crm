import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
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
import { DEAL_STAGES } from "@/lib/deal-stages";
import { getDealsForContact } from "@/lib/deals";
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

// Not async: the back link renders instantly as part of the static shell,
// and everything that depends on the contact ID streams in inside Suspense.
export default function ContactPage({ params }: PageProps<"/contacts/[id]">) {
  return (
    <div className="space-y-6">
      <Link
        href="/contacts"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeftIcon className="size-4" />
        All contacts
      </Link>

      <Suspense fallback={<ContactDetailsSkeleton />}>
        <ContactDetails params={params} />
      </Suspense>
    </div>
  );
}

interface ContactDetailsProps {
  params: PageProps<"/contacts/[id]">["params"];
}

async function ContactDetails({ params }: ContactDetailsProps) {
  const { id } = await params;
  const contact = getContactById(id);
  if (!contact) notFound();
  const deals = await getDealsForContact(contact.id);

  return (
    <>

      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <ContactAvatar name={contact.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-display font-semibold tracking-tight text-slate-900">
              {contact.name}
            </h1>
            <StatusBadge status={contact.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {contact.company}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-500"
          >
            <MailIcon className="size-4" />
            Email
          </a>
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <PhoneIcon className="size-4" />
            Call
          </a>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Contact details" />
          <dl className="divide-y divide-slate-100">
            <DetailRow icon={MailIcon} label="Email">
              <a href={`mailto:${contact.email}`} className="text-accent-600 hover:underline">
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
              <dt className="text-xs font-medium text-slate-500">Deal value</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {formatCurrency(contact.dealValue)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Last contacted</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {formatDate(contact.lastContacted)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Added to CRM</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {formatDate(contact.createdAt)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Deals"
          description={`${deals.length} ${deals.length === 1 ? "deal" : "deals"} with ${contact.company}`}
          action={
            <Link href="/deals" className="text-sm font-medium text-accent-600 hover:text-accent-700">
              View pipeline
            </Link>
          }
        />
        {deals.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {deals.map((deal) => {
              const stage = DEAL_STAGES.find((item) => item.id === deal.stage);
              return (
                <li key={deal.id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{deal.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Expected close {formatDate(deal.expectedClose)} · {deal.owner}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <span className={`size-2 rounded-full ${stage?.dotClass}`} aria-hidden="true" />
                      {stage?.label}
                    </span>
                    <span className="w-20 text-right font-medium text-slate-900 tabular-nums">
                      {formatCurrency(deal.value)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-slate-500">No deals yet.</p>
        )}
      </Card>
    </>
  );
}

function ContactDetailsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading contact">
      <Card className="flex items-center gap-5 p-6">
        <div className="size-16 animate-pulse rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white lg:col-span-2" />
        <div className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white" />
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
      <Icon className="size-4 shrink-0 text-slate-400" />
      <dt className="w-24 shrink-0 text-slate-500">{label}</dt>
      <dd className="min-w-0 truncate text-slate-900">{children}</dd>
    </div>
  );
}

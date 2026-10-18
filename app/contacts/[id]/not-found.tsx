import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function ContactNotFound() {
  return (
    <Card className="px-6 py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
        Contact not found
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        This contact may have been removed, or the link is incorrect.
      </p>
      <Link
        href="/contacts"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
      >
        Back to contacts
      </Link>
    </Card>
  );
}

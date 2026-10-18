import { Card } from "@/components/ui/Card";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      <Card className="flex h-64 items-center justify-center border-dashed">
        <p className="text-sm text-zinc-400">Coming soon</p>
      </Card>
    </div>
  );
}

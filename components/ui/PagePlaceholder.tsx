import { Card } from "@/components/ui/Card";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <Card className="flex h-64 items-center justify-center border-dashed">
        <p className="text-sm text-slate-400">Coming soon</p>
      </Card>
    </div>
  );
}

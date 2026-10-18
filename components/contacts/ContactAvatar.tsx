import { getInitials } from "@/lib/format";

const SIZE_STYLES = {
  sm: "size-8 text-xs",
  lg: "size-16 text-xl",
} as const;

interface ContactAvatarProps {
  name: string;
  size?: keyof typeof SIZE_STYLES;
}

export function ContactAvatar({ name, size = "sm" }: ContactAvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600 ${SIZE_STYLES[size]}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}

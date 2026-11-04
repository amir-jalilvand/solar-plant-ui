import { Icon } from "./Icon";
import { cn } from "./ui";
import { jalaliTime } from "../lib/format";
import type { TimelineEvent } from "../lib/types";

const toneStyle: Record<TimelineEvent["tone"], string> = {
  default: "bg-info text-white",
  success: "bg-success text-white",
  warn: "bg-warn text-white",
  danger: "bg-danger text-white",
  info: "bg-info text-white",
};

const toneIcon: Record<TimelineEvent["tone"], "check" | "alert" | "clock" | "file" | "zap"> = {
  default: "file",
  success: "check",
  warn: "clock",
  danger: "alert",
  info: "zap",
};

export function Timeline({ items, compact = false }: { items: TimelineEvent[]; compact?: boolean }) {
  if (items.length === 0) {
    return <p className="px-2 py-6 text-center text-xs text-muted">رویدادی ثبت نشده است.</p>;
  }
  return (
    <ol className="relative space-y-4 pr-5">
      <span className="absolute bottom-2 right-[9px] top-2 w-px bg-line" aria-hidden="true" />
      {items.map((event) => (
        <li key={event.id} className="relative">
          <span className={cn("absolute -right-5 top-0.5 grid size-[18px] place-items-center rounded-full ring-4 ring-card", toneStyle[event.tone])}>
            <Icon name={toneIcon[event.tone]} size={10} />
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-bold">{event.action}</p>
            <time className="text-[0.65rem] text-muted" dateTime={event.at}>
              {jalaliTime(event.at)}
            </time>
          </div>
          <p className="mt-0.5 text-xs leading-6 text-muted">
            <span className="font-semibold text-ink">{event.actor}</span> — {event.detail}
            {!compact ? "" : null}
          </p>
        </li>
      ))}
    </ol>
  );
}

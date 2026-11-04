import {
  useEffect,
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { Icon, type IconName } from "./Icon";
import { faNum } from "../lib/format";
import { SUBSTAGE } from "../lib/labels";
import type { SubStage } from "../lib/types";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ---------------------------------- Button --------------------------------- */

type Variant = "primary" | "accent" | "ghost" | "danger" | "subtle";

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "md" | "sm"; icon?: IconName }) {
  const map: Record<Variant, string> = {
    primary: "btn-primary",
    accent: "btn-accent",
    ghost: "btn-ghost",
    danger: "btn-danger",
    subtle: "border-line bg-card text-ink hover:bg-line-soft",
  };
  return (
    <button type="button" className={cn("btn", map[variant], size === "sm" && "btn-sm", className)} {...rest}>
      {icon ? <Icon name={icon} size={size === "sm" ? 15 : 17} /> : null}
      {children}
    </button>
  );
}

/* ---------------------------------- Badge ---------------------------------- */

type BadgeTone = "neutral" | "success" | "warn" | "danger" | "info" | "accent";

const badgeTone: Record<BadgeTone, string> = {
  neutral: "bg-line-soft text-muted border-line",
  success: "bg-success-soft text-success border-success/30",
  warn: "bg-warn-soft text-warn border-warn/30",
  danger: "bg-danger-soft text-danger border-danger/30",
  info: "bg-info-soft text-info border-info/30",
  accent: "bg-accent-soft text-warn border-accent/40",
};

export function Badge({ tone = "neutral", children, dot = false, className }: { tone?: BadgeTone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn("chip", badgeTone[tone], className)}>
      {dot ? <span className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: SubStage }) {
  const meta = SUBSTAGE[status];
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  );
}

/* ---------------------------------- Card ----------------------------------- */

export function Card({ children, className, as: As = "section" }: { children: ReactNode; className?: string; as?: "section" | "div" | "article" }) {
  return <As className={cn("card", className)}>{children}</As>;
}

export function CardHeader({ title, subtitle, action, icon }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; icon?: IconName }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
      <div className="flex items-start gap-2">
        {icon ? (
          <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-line-soft text-muted">
            <Icon name={icon} size={16} />
          </span>
        ) : null}
        <div>
          <h3 className="text-[0.95rem] font-bold">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ---------------------------------- Fields --------------------------------- */

export function Field({ label, hint, error, required, children }: { label: string; hint?: string; error?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-danger">
          <Icon name="alert" size={13} /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("input", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("textarea", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("select", className)} {...rest}>
      {children}
    </select>
  );
}

/* ---------------------------------- Modal ---------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const w = width === "sm" ? "max-w-md" : width === "lg" ? "max-w-3xl" : "max-w-xl";

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-[#0b1622]/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={title} className={cn("relative w-full rounded-t-2xl border border-line-soft bg-card shadow-2xl sm:rounded-2xl", w)}>
        <div className="flex items-start justify-between gap-4 border-b border-line-soft px-5 py-4">
          <div>
            <h2 className="text-base font-bold">{title}</h2>
            {description ? <p className="mt-1 text-xs leading-6 text-muted">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-line-soft" aria-label="بستن">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="flex flex-wrap justify-start gap-2 border-t border-line-soft px-5 py-3">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-[#0b1622]/50" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 left-0 flex w-[min(92vw,24rem)] flex-col border-r border-line-soft bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <h2 className="text-base font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-line-soft" aria-label="بستن">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </div>,
    document.body,
  );
}

/* ----------------------------------- Tabs ---------------------------------- */

export function Tabs<T extends string>({ items, value, onChange }: { items: { key: T; label: string; count?: number }[]; value: T; onChange: (key: T) => void }) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-line-soft">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "relative shrink-0 px-3.5 py-2.5 text-sm font-semibold transition-colors",
              active ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {item.label}
            {typeof item.count === "number" ? <span className="mr-1.5 rounded-full bg-line-soft px-1.5 text-[0.7rem]">{faNum(item.count)}</span> : null}
            {active ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" /> : null}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------- States ------------------------------------ */

export function EmptyState({ title, description, action, icon = "folder" }: { title: string; description?: string; action?: ReactNode; icon?: IconName }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-line-soft text-muted">
        <Icon name={icon} size={26} />
      </span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        {description ? <p className="mx-auto mt-1 max-w-md text-xs leading-6 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ onRetry, message = "دریافت اطلاعات با خطا مواجه شد." }: { onRetry?: () => void; message?: string }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-danger-soft text-danger">
        <Icon name="alert" size={26} />
      </span>
      <div>
        <p className="text-sm font-bold">خطا در دریافت داده</p>
        <p className="mt-1 text-xs text-muted">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="ghost" size="sm" icon="refresh" onClick={onRetry}>
          تلاش مجدد
        </Button>
      ) : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-3.5 w-full", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="card space-y-3 p-5">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- Progress -------------------------------- */

export function ProgressBar({ value, tone = "accent", className }: { value: number; tone?: "accent" | "success" | "danger" | "info"; className?: string }) {
  const colors: Record<string, string> = {
    accent: "bg-accent",
    success: "bg-success",
    danger: "bg-danger",
    info: "bg-info",
  };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-line-soft", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full transition-all", colors[tone])} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
    </div>
  );
}

/* ----------------------------------- KPI ----------------------------------- */

export function Kpi({ label, value, hint, icon, trend }: { label: string; value: ReactNode; hint?: ReactNode; icon?: IconName; trend?: { value: string; up: boolean } }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-muted">{label}</p>
        {icon ? (
          <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-warn">
            <Icon name={icon} size={16} />
          </span>
        ) : null}
      </div>
      <p className="num mt-2 text-xl font-extrabold tracking-tight">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {trend ? (
          <span className={cn("flex items-center gap-0.5 text-[0.7rem] font-bold", trend.up ? "text-success" : "text-danger")}>
            <Icon name={trend.up ? "arrowUp" : "arrowDown"} size={12} />
            {trend.value}
          </span>
        ) : null}
        {hint ? <span className="text-[0.7rem] text-muted">{hint}</span> : null}
      </div>
    </div>
  );
}

/* --------------------------------- Header ---------------------------------- */

export function PageHeader({ title, subtitle, actions, back }: { title: string; subtitle?: ReactNode; actions?: ReactNode; back?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {back}
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-xs leading-6 text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/* --------------------------------- Avatar ---------------------------------- */

const avatarTones = ["bg-[#1e3a5f] text-white", "bg-[#7a4b12] text-white", "bg-[#1f5c47] text-white", "bg-[#4a3566] text-white", "bg-[#6b2f2f] text-white"];

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initial = name.trim().charAt(0);
  const idx = name.length % avatarTones.length;
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full font-bold", avatarTones[idx])} style={{ width: size, height: size, fontSize: size / 2.6 }} aria-hidden="true">
      {initial}
    </span>
  );
}

/* --------------------------------- Search ---------------------------------- */

export function SearchBox({ value, onChange, placeholder = "جست‌وجو…", className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <Icon name="search" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input pr-9" aria-label={placeholder} />
    </div>
  );
}

/* -------------------------------- Pagination ------------------------------- */

export function Pagination({ page, pageSize, total, onChange }: { page: number; pageSize: number; total: number; onChange: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft px-4 py-3 text-xs text-muted">
      <span>
        نمایش {faNum(Math.min(total, (page - 1) * pageSize + 1))} تا {faNum(Math.min(total, page * pageSize))} از {faNum(total)} مورد
      </span>
      <div className="flex items-center gap-1">
        <button type="button" className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="صفحه قبل">
          <Icon name="chevronRight" size={15} />
        </button>
        {Array.from({ length: Math.min(5, pages) }).map((_, i) => {
          const start = Math.max(1, Math.min(page - 2, pages - 4));
          const p = start + i;
          if (p > pages) return null;
          return (
            <button key={p} type="button" onClick={() => onChange(p)} className={cn("btn btn-sm min-w-8", p === page ? "btn-primary" : "btn-ghost")} aria-current={p === page ? "page" : undefined}>
              {faNum(p)}
            </button>
          );
        })}
        <button type="button" className="btn btn-ghost btn-sm" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="صفحه بعد">
          <Icon name="chevronLeft" size={15} />
        </button>
      </div>
    </div>
  );
}

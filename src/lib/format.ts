const nf = new Intl.NumberFormat("fa-IR");
const nf1 = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });

export function faNum(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return String(value);
  return nf.format(n);
}

export function num1(value: number): string {
  return nf1.format(value);
}

export function money(value: number): string {
  return `${faNum(value)} تومان`;
}

export function moneyShort(value: number): string {
  if (value >= 1_000_000_000) return `${num1(value / 1_000_000_000)} میلیارد تومان`;
  if (value >= 1_000_000) return `${num1(value / 1_000_000)} میلیون تومان`;
  if (value >= 1_000) return `${num1(value / 1_000)} هزار تومان`;
  return money(value);
}

export function jalali(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(d);
}

export function jalaliShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function jalaliTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

const rtf = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });

export function relative(iso: string): string {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "—";
  const diff = (d - Date.now()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  if (abs < 86400 * 365) return rtf.format(Math.round(diff / (86400 * 30)), "month");
  return rtf.format(Math.round(diff / (86400 * 365)), "year");
}

export function percent(value: number): string {
  return `${faNum(Math.round(value))}٪`;
}

export function digitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

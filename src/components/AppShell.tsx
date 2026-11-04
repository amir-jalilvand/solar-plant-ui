import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon, type IconName } from "./Icon";
import { Avatar, Button, Drawer, cn } from "./ui";
import { useRole } from "../lib/role";
import { useTheme } from "../lib/theme";
import { useDemo, type DemoState } from "../lib/demo";
import { ROLES, ROLE_ORDER } from "../lib/labels";
import { notifications } from "../lib/data";
import { relative } from "../lib/format";
import type { Role } from "../lib/types";

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
}

const NAV: Record<Role, NavItem[]> = {
  applicant: [
    { to: "/applicant", label: "داشبورد", icon: "home", end: true },
    { to: "/applicant/projects", label: "پروژه‌های من", icon: "folder" },
    { to: "/applicant/new", label: "درخواست احداث", icon: "plus" },
    { to: "/applicant/finance", label: "قرارداد و پرداخت", icon: "wallet" },
    { to: "/applicant/support", label: "خدمات پس از فروش", icon: "wrench" },
  ],
  installer: [
    { to: "/installer", label: "داشبورد", icon: "home", end: true },
    { to: "/installer/projects", label: "پروژه‌های ارجاعی", icon: "folder" },
    { to: "/installer/profile", label: "پروفایل فنی", icon: "shield" },
  ],
  inspector: [
    { to: "/inspector", label: "صف بررسی", icon: "checkCircle", end: true },
    { to: "/inspector/history", label: "سابقه بررسی‌ها", icon: "clock" },
  ],
  admin: [
    { to: "/admin", label: "داشبورد", icon: "home", end: true },
    { to: "/admin/projects", label: "پروژه‌ها", icon: "folder" },
    { to: "/admin/installers", label: "نصابان", icon: "wrench" },
    { to: "/admin/finance", label: "مالی و پرداخت", icon: "wallet" },
    { to: "/admin/evaluation", label: "ارزیابی نصابان", icon: "star" },
    { to: "/admin/users", label: "کاربران و دسترسی", icon: "users" },
    { to: "/admin/reports", label: "گزارش‌ها", icon: "chart" },
  ],
  satba: [
    { to: "/satba", label: "داشبورد نظارتی", icon: "home", end: true },
    { to: "/satba/projects", label: "پروژه‌ها", icon: "folder" },
    { to: "/satba/reports", label: "گزارش عملکرد", icon: "chart" },
    { to: "/satba/api", label: "اتصال API", icon: "external" },
  ],
};

const DEMO_LABEL: Record<DemoState, string> = {
  live: "عادی",
  loading: "بارگذاری",
  empty: "خالی",
  error: "خطا",
};

export function AppShell({ children }: { children: ReactNode }) {
  const { role, setRole, user } = useRole();
  const { theme, toggle } = useTheme();
  const { demo, setDemo } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const items = NAV[role];
  const myNotifications = notifications.filter((n) => n.userId === role || (role === "admin" && n.userId === "admin"));
  const unread = myNotifications.filter((n) => !n.read).length;

  const switchRole = (next: Role) => {
    setRole(next);
    navigate(ROLES[next].home);
    setMenuOpen(false);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-4">
        <span className="grid size-10 place-items-center rounded-xl bg-brand text-brand-ink">
          <Icon name="sun" size={22} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">سامانه خورشیدی انشعابی</p>
          <p className="truncate text-[0.65rem] text-muted">مدیریت و نظارت — نسخه دمو</p>
        </div>
      </div>

      <div className="border-b border-line-soft px-3 py-3">
        <label htmlFor="role-switch" className="label mb-1 px-1">
          مشاهده به‌عنوان
        </label>
        <div className="relative">
          <select
            id="role-switch"
            value={role}
            onChange={(e) => switchRole(e.target.value as Role)}
            className="select pr-8 text-sm font-semibold"
            aria-label="تغییر نقش"
          >
            {ROLE_ORDER.map((r) => (
              <option key={r} value={r}>
                {ROLES[r].label}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3" aria-label="منوی اصلی">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                isActive ? "bg-accent-soft text-warn" : "text-muted hover:bg-line-soft hover:text-ink",
              )
            }
          >
            <Icon name={item.icon} size={17} />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line-soft p-3">
        <div className="flex items-center gap-2 rounded-xl bg-bg/70 p-2">
          <Avatar name={user} size={34} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">{user}</p>
            <p className="truncate text-[0.65rem] text-muted">{ROLES[role].label}</p>
          </div>
          <button type="button" className="rounded-lg p-1.5 text-muted hover:bg-line-soft" aria-label="خروج" title="خروج (دمو)">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-bg">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 border-l border-line-soft bg-card lg:block">{sidebar}</aside>

      <div className="lg:pr-64">
        <header className="sticky top-0 z-30 border-b border-line-soft bg-bg/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 sm:px-5">
            <button type="button" onClick={() => setMenuOpen(true)} className="rounded-lg p-2 text-muted hover:bg-line-soft lg:hidden" aria-label="باز کردن منو">
              <Icon name="menu" size={19} />
            </button>

            <div className="hidden items-center gap-2 text-xs text-muted sm:flex">
              <Icon name="shield" size={14} />
              <span>{ROLES[role].label}</span>
              <span className="text-line">/</span>
              <span className="font-semibold text-ink">{(items.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to))) ?? items[0]).label}</span>
            </div>

            <div className="mr-auto flex items-center gap-1.5">
              <div className="hidden items-center gap-1.5 rounded-xl border border-line bg-card px-2 py-1 sm:flex">
                <span className="text-[0.65rem] text-muted">حالت صفحه:</span>
                <select
                  value={demo}
                  onChange={(e) => setDemo(e.target.value as DemoState)}
                  className="bg-transparent px-1 py-0.5 text-[0.7rem] font-semibold outline-none"
                  aria-label="حالت نمایش صفحه"
                >
                  {(Object.keys(DEMO_LABEL) as DemoState[]).map((d) => (
                    <option key={d} value={d}>
                      {DEMO_LABEL[d]}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={toggle} className="rounded-lg p-2 text-muted hover:bg-line-soft" aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}>
                <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
              </button>

              <button type="button" onClick={() => setBellOpen(true)} className="relative rounded-lg p-2 text-muted hover:bg-line-soft" aria-label="اعلان‌ها">
                <Icon name="bell" size={18} />
                {unread > 0 ? <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-danger text-[0.55rem] font-bold text-white">{unread}</span> : null}
              </button>

              <div className="mr-1 flex items-center gap-2 rounded-xl border border-line bg-card py-1 pl-2 pr-1">
                <Avatar name={user} size={26} />
                <span className="hidden max-w-32 truncate text-xs font-semibold sm:block">{user}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-3 pb-24 pt-5 sm:px-5 lg:pb-10">{children}</main>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="منو">
        <div className="h-[calc(100vh-6rem)]">{sidebar}</div>
      </Drawer>

      <Drawer open={bellOpen} onClose={() => setBellOpen(false)} title="اعلان‌ها">
        <ul className="space-y-2">
          {myNotifications.length === 0 ? <li className="py-8 text-center text-xs text-muted">اعلانی وجود ندارد.</li> : null}
          {myNotifications.map((n) => (
            <li key={n.id} className={cn("rounded-xl border p-3 text-xs", n.read ? "border-line-soft bg-card" : "border-accent/30 bg-accent-soft/40")}>
              <div className="flex items-start gap-2">
                <span className={cn("mt-1 size-2 shrink-0 rounded-full", n.read ? "bg-line" : "bg-accent")} />
                <div>
                  <p className="leading-6 text-ink">{n.text}</p>
                  <p className="mt-1 text-[0.65rem] text-muted">{relative(n.date)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Button variant="ghost" size="sm" className="w-full" icon="check" onClick={() => setBellOpen(false)}>
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </Button>
        </div>
      </Drawer>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line-soft bg-card/95 backdrop-blur lg:hidden" aria-label="منوی موبایل">
        <div className="mx-auto flex max-w-lg items-stretch justify-between px-1">
          {items.slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn("flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[0.6rem] font-semibold", isActive ? "text-warn" : "text-muted")
              }
            >
              <Icon name={item.icon} size={19} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
          {items.length > 4 ? (
            <button type="button" onClick={() => setMenuOpen(true)} className="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[0.6rem] font-semibold text-muted">
              <Icon name="menu" size={19} />
              <span>بیشتر</span>
            </button>
          ) : null}
        </div>
      </nav>

      <Link to="/" className="sr-only">
        بازگشت به خانه
      </Link>
    </div>
  );
}

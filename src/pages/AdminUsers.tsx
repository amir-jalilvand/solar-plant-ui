import { Badge, Card, CardHeader, ErrorState, PageHeader, SkeletonTable } from "../components/ui";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { users } from "../lib/data";
import { faNum, relative } from "../lib/format";
import { ROLES } from "../lib/labels";
import type { Role } from "../lib/types";

const PERMISSIONS: { key: string; label: string; roles: Role[] }[] = [
  { key: "view", label: "مشاهده پروژه‌ها", roles: ["applicant", "installer", "inspector", "admin", "satba"] },
  { key: "create", label: "ثبت درخواست", roles: ["applicant", "admin"] },
  { key: "execute", label: "ثبت پیشرفت و مدارک اجرا", roles: ["installer"] },
  { key: "review", label: "تأیید / رد مدارک", roles: ["inspector", "admin"] },
  { key: "finance", label: "مدیریت مالی و پرداخت", roles: ["admin"] },
  { key: "assign", label: "تخصیص نصاب", roles: ["admin"] },
  { key: "users", label: "مدیریت کاربران", roles: ["admin"] },
  { key: "monitor", label: "نظارت کلان (خواندنی)", roles: ["satba"] },
];

export default function AdminUsers() {
  const q = useMockQuery(() => users, []);
  if (q.status === "loading") return <Card><SkeletonTable rows={6} /></Card>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  return (
    <div>
      <PageHeader title="کاربران و دسترسی‌ها" subtitle="ماتریس نقش × مجوز و مدیریت وضعیت کاربران" />

      <Card className="mb-4 overflow-hidden">
        <CardHeader title="ماتریس دسترسی (RBAC)" subtitle="هر نقش فقط منوی مربوط به خود را می‌بیند" icon="lock" />
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>دسترسی</th>
                {(Object.keys(ROLES) as Role[]).map((r) => <th key={r} className="text-center">{ROLES[r].short}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p.key}>
                  <td className="text-xs font-semibold">{p.label}</td>
                  {(Object.keys(ROLES) as Role[]).map((r) => (
                    <td key={r} className="text-center">
                      {p.roles.includes(r) ? <Icon name="checkCircle" size={16} className="mx-auto text-success" /> : <span className="text-line">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader title="کاربران سامانه" subtitle={`${faNum(users.length)} کاربر ثبت‌شده`} icon="users" />
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>کاربر</th>
                <th>نقش</th>
                <th className="hidden sm:table-cell">موبایل</th>
                <th>وضعیت</th>
                <th className="hidden md:table-cell">آخرین فعالیت</th>
              </tr>
            </thead>
            <tbody>
              {q.data!.map((u) => (
                <tr key={u.id}>
                  <td className="text-xs font-semibold">{u.name}</td>
                  <td className="text-xs text-muted">{ROLES[u.role].label}</td>
                  <td className="num hidden text-xs text-muted sm:table-cell">{u.mobile}</td>
                  <td>
                    <Badge tone={u.status === "active" ? "success" : u.status === "pending" ? "warn" : "danger"} dot>
                      {u.status === "active" ? "فعال" : u.status === "pending" ? "در انتظار تأیید" : "مسدود"}
                    </Badge>
                  </td>
                  <td className="hidden text-[0.7rem] text-muted md:table-cell">{relative(u.lastSeen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-3 text-[0.7rem] text-muted">در نسخه اول، نقش ساتبا فقط دسترسی مشاهده دارد و هیچ دکمه ویرایشی برای آن نمایش داده نمی‌شود.</p>
    </div>
  );
}

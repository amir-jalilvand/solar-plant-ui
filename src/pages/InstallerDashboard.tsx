import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, CardHeader, EmptyState, ErrorState, Field, Kpi, Modal, ProgressBar, SkeletonCard, Textarea } from "../components/ui";
import { useMockQuery } from "../lib/demo";
import { useToast } from "../components/Toast";
import { useRole } from "../lib/role";
import { projectsOfInstaller } from "../lib/data";
import { faNum, jalali, num1 } from "../lib/format";
import { stageLabel } from "../lib/labels";

export default function InstallerDashboard() {
  const { user } = useRole();
  const { toast } = useToast();
  const q = useMockQuery(() => projectsOfInstaller(user), []);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  if (q.status === "loading") {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      </div>
    );
  }
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const list = q.data ?? [];
  const active = list.filter((p) => ["installer_assignment", "execution", "testing", "handover"].includes(p.stage));
  const waiting = list.filter((p) => p.subStage === "waiting_review");
  const assigned = list.filter((p) => p.stage === "installer_assignment");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted">پنل نصاب / پیمانکار</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">{user}</h1>
          <p className="mt-1 text-xs text-muted">مدیریت پروژه‌های ارجاعی، اجرا و مدارک فنی</p>
        </div>
        <Button variant="ghost" icon="refresh" onClick={q.reload}>به‌روزرسانی</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="پروژه‌های ارجاعی" value={faNum(list.length)} hint="کل پروژه‌های تخصیص‌یافته" icon="folder" />
        <Kpi label="در حال اجرا" value={faNum(active.length)} hint="نیازمند گزارش پیشرفت" icon="wrench" />
        <Kpi label="منتظر بررسی" value={faNum(waiting.length)} hint="در صف کارشناس فنی" icon="clock" />
        <Kpi label="ظرفیت آزاد" value={`${num1(420)} کیلووات`} hint="از ۱۲۰۰ کیلووات ظرفیت" icon="zap" />
      </div>

      {q.isEmpty || list.length === 0 ? (
        <Card><EmptyState icon="folder" title="پروژه‌ای به شما ارجاع نشده" description="پس از تخصیص پروژه توسط مدیر سکو، در این صفحه نمایش داده می‌شود." /></Card>
      ) : (
        <>
          <Card>
            <CardHeader title="پروژه‌های ارجاعی جدید" subtitle="پیش از شروع اجرا، قبول یا رد کنید" icon="bell" action={<Badge tone="warn">{faNum(assigned.length)} مورد</Badge>} />
            <div className="divide-y divide-line-soft">
              {assigned.length === 0 ? <p className="px-4 py-6 text-center text-xs text-muted">مورد جدیدی در انتظار پاسخ نیست.</p> : null}
              {assigned.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link to={`/projects/${p.id}`} className="num text-xs font-bold hover:text-warn">{p.code}</Link>
                      <Badge tone="info">{stageLabel(p.stage)}</Badge>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted">{p.applicantName} — {p.city} — {num1(p.capacityKw)} کیلووات</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="primary" icon="check" onClick={() => toast(`پروژه ${p.code} پذیرفته شد.`)}>قبول</Button>
                    <Button size="sm" variant="danger" onClick={() => setRejectId(p.id)}>رد</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="پروژه‌های در جریان" subtitle="گزارش پیشرفت، تجهیزات و مدارک" icon="wrench" action={<Link to="/installer/projects" className="text-xs font-bold text-warn">همه پروژه‌ها</Link>} />
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>کد</th>
                    <th>متقاضی</th>
                    <th className="hidden sm:table-cell">ظرفیت</th>
                    <th>مرحله</th>
                    <th>پیشرفت</th>
                    <th className="hidden md:table-cell">مهلت</th>
                    <th aria-label="جزئیات" />
                  </tr>
                </thead>
                <tbody>
                  {active.map((p) => (
                    <tr key={p.id}>
                      <td><Link to={`/projects/${p.id}`} className="num text-xs font-bold hover:text-warn">{p.code}</Link></td>
                      <td className="text-xs">{p.applicantName}</td>
                      <td className="num hidden text-xs sm:table-cell">{num1(p.capacityKw)} کیلووات</td>
                      <td className="text-xs">{stageLabel(p.stage)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={p.progress} className="w-16" tone={p.subStage === "blocked" ? "danger" : "accent"} />
                          <span className="num text-[0.7rem] text-muted">{faNum(p.progress)}٪</span>
                        </div>
                      </td>
                      <td className="hidden text-xs text-muted md:table-cell">{jalali(p.updatedAt)}</td>
                      <td><Link to={`/projects/${p.id}`} className="btn btn-ghost btn-sm">گزارش</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <Modal
        open={Boolean(rejectId)}
        onClose={() => setRejectId(null)}
        title="رد پروژه ارجاعی"
        description="دلیل رد برای مدیر سکو ثبت می‌شود."
        footer={
          <>
            <Button
              variant="danger"
              disabled={reason.trim().length < 5}
              onClick={() => {
                toast("پروژه رد شد و دلیل ثبت گردید.", "danger");
                setRejectId(null);
                setReason("");
              }}
            >
              ثبت رد
            </Button>
            <Button variant="ghost" onClick={() => setRejectId(null)}>انصراف</Button>
          </>
        }
      >
        <Field label="دلیل رد" required hint="حداقل ۵ نویسه">
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="مثلاً ظرفیت آزاد کافی در این منطقه نداریم." />
        </Field>
      </Modal>
    </div>
  );
}

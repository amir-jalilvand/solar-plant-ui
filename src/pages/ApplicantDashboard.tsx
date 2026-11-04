import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { Badge, Button, Card, CardHeader, EmptyState, ErrorState, Kpi, Skeleton, SkeletonCard } from "../components/ui";
import { NextActionCard, ProjectMiniCard } from "../components/ProjectBits";
import { ProjectStepper } from "../components/ProjectStepper";
import { Timeline } from "../components/Timeline";
import { useMockQuery } from "../lib/demo";
import { applicantName, eventsOf, projectById, projectsOfApplicant, paymentsOf } from "../lib/data";
import { faNum, jalali, moneyShort, num1 } from "../lib/format";
import { stageLabel } from "../lib/labels";

export default function ApplicantDashboard() {
  const [current, setCurrent] = useState(0);
  const q = useMockQuery(() => {
    const list = projectsOfApplicant(applicantName);
    const active = list.filter((p) => !["after_sales", "handover"].includes(p.stage)).sort((a, b) => b.progress - a.progress);
    return { list, active };
  }, []);
  const today = new Intl.DateTimeFormat("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date());

  useEffect(() => {
    if (q.data && q.data.active.length > 0) setCurrent(0);
  }, [q.data]);

  if (q.status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      </div>
    );
  }
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const { list, active } = q.data!;
  const project = active[current] ?? active[0] ?? list[0];
  const detail = projectById(project.id)!;
  const nextPayment = paymentsOf(project.id).find((p) => p.status !== "paid");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted">{today}</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">سلام {applicantName} 👋</h1>
          <p className="mt-1 text-xs text-muted">وضعیت نیروگاه‌های خورشیدی شما در یک نگاه</p>
        </div>
        <Link to="/applicant/new" className="btn btn-accent">
          <Icon name="plus" size={16} />
          درخواست احداث جدید
        </Link>
      </div>

      {q.isEmpty ? (
        <Card>
          <EmptyState
            icon="sun"
            title="هنوز پروژه‌ای ثبت نکرده‌اید"
            description="برای شروع، درخواست احداث نیروگاه خورشیدی را ثبت کنید؛ کارشناسان ما در هر مرحله همراه شما هستند."
            action={<Link to="/applicant/new" className="btn btn-primary">ثبت درخواست</Link>}
          />
        </Card>
      ) : (
        <>
          <section className="overflow-hidden rounded-2xl border border-brand/40 bg-brand text-brand-ink shadow-lg">
            <div className="relative p-5">
              <div className="pointer-events-none absolute -left-12 -top-16 size-56 rounded-full bg-accent/20 blur-2xl" aria-hidden="true" />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] text-white/60">پروژه در جریان</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Link to={`/projects/${detail.id}`} className="num text-lg font-extrabold hover:underline">
                      {detail.code}
                    </Link>
                    <Badge tone="accent">{stageLabel(detail.stage)}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-white/75">
                    <Icon name="pin" size={13} /> {detail.city} — {detail.address}
                  </p>
                </div>
                <div className="text-left">
                  <p className="num text-2xl font-extrabold">{num1(detail.capacityKw)} <span className="text-xs font-medium text-white/70">کیلووات</span></p>
                  <p className="text-[0.7rem] text-white/60">ظرفیت نصب</p>
                </div>
              </div>

              <div className="relative mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[0.7rem] text-white/70">
                  <span>پیشرفت اجرا</span>
                  <span className="num font-bold text-white">{faNum(detail.progress)}٪</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${detail.progress}%` }} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.7rem] text-white/70">
                  <span className="flex items-center gap-1"><Icon name="user" size={12} /> نصاب: {detail.installerName}</span>
                  <span className="flex items-center gap-1"><Icon name="calendar" size={12} /> ثبت: {jalali(detail.createdAt)}</span>
                  <span className="flex items-center gap-1"><Icon name="wallet" size={12} /> مبلغ قرارداد: {moneyShort(detail.amount)}</span>
                </div>
              </div>

              {active.length > 1 ? (
                <div className="relative mt-4 flex flex-wrap gap-1.5">
                  {active.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCurrent(i)}
                      className={`num rounded-lg px-2.5 py-1 text-[0.7rem] font-bold transition-colors ${i === current ? "bg-white text-brand" : "bg-white/10 text-white hover:bg-white/20"}`}
                    >
                      {p.code}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <ProjectStepper project={detail} tone="dark" />
            </div>
          </section>

          <NextActionCard project={detail} />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="پروژه‌های من" value={faNum(list.length)} hint="شامل پروژه‌های تحویل‌شده" icon="folder" />
            <Kpi label="ظرفیت کل" value={`${num1(list.reduce((s, p) => s + p.capacityKw, 0))} کیلووات`} hint="مجموع ظرفیت نصب" icon="zap" />
            <Kpi
              label="پرداخت بعدی"
              value={nextPayment ? moneyShort(nextPayment.amount) : "تسویه شده"}
              hint={nextPayment ? `سررسید ${jalali(nextPayment.dueDate)}` : "همه اقساط پرداخت شد"}
              icon="wallet"
            />
            <Kpi label="امتیاز رضایت" value={`${num1(4.8)} از ۵`} hint="بر اساس آخرین بازخورد شما" icon="star" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="پروژه‌های من" subtitle="همه پروژه‌ها با وضعیت لحظه‌ای" icon="folder" action={<Link to="/applicant/projects" className="text-xs font-bold text-warn">مشاهده همه</Link>} />
              <div className="grid gap-3 p-4 sm:grid-cols-2">
                {list.slice(0, 4).map((p) => (
                  <ProjectMiniCard key={p.id} project={p} />
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="آخرین رویدادها" subtitle="خط زمانی پروژه فعال" icon="clock" />
              <div className="p-4">
                <Timeline items={eventsOf(detail.id).slice(0, 4)} compact />
                <Link to={`/projects/${detail.id}`} className="mt-3 block text-center text-xs font-bold text-warn">
                  مشاهده تاریخچه کامل
                </Link>
              </div>
            </Card>
          </div>

          <Card className="border-accent/30 bg-accent-soft/40 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-accent text-[#1a1205]"><Icon name="sparkles" size={16} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">مصرف و درآمد تخمینی</p>
                <p className="text-xs text-muted">با ظرفیت فعلی، تولید سالانه حدود {num1(detail.capacityKw * 1600)} کیلووات‌ساعت و صرفه‌جویی سالانه حدود {moneyShort(detail.capacityKw * 1600 * 3500)} برآورد می‌شود.</p>
              </div>
              <Button variant="ghost" size="sm" icon="chart">گزارش تولید</Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

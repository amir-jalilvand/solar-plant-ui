import { Link } from "react-router-dom";
import { Badge, Card, CardHeader, ErrorState, Kpi, ProgressBar, SkeletonCard, SkeletonTable } from "../components/ui";
import { Icon } from "../components/Icon";
import { BarChart, Donut, LineChart } from "../components/Charts";
import { useMockQuery } from "../lib/demo";
import { projects, stats, payments } from "../lib/data";
import { faNum, moneyShort, num1, percent } from "../lib/format";
import { stageLabel, STAGES } from "../lib/labels";

export default function AdminDashboard() {
  const q = useMockQuery(() => ({ projects, stats, payments }), []);

  if (q.status === "loading") {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
        <SkeletonTable rows={5} />
      </div>
    );
  }
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const stageData = stats.byStage;
  const revenueSeries = [0.42, 0.55, 0.48, 0.7, 0.66, 0.82, 0.95, 0.88, 1.05, 1.2, 1.12, 1.3];
  const alerts = projects.filter((p) => p.subStage === "blocked" || p.subStage === "rejected" || payments.some((pay) => pay.projectId === p.id && pay.status === "overdue"));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted">پنل مدیر سکو</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">نمای کلی سامانه</h1>
          <p className="mt-1 text-xs text-muted">سلامت عملیات، گردش مالی و بار کاری در یک نگاه</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/reports" className="btn btn-ghost"><Icon name="download" size={15} /> خروجی گزارش</Link>
          <Link to="/admin/projects" className="btn btn-primary">مدیریت پروژه‌ها</Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="کل پروژه‌ها" value={faNum(stats.totalProjects)} hint={`${faNum(stats.activeProjects)} پروژه فعال`} icon="folder" trend={{ value: "۱۲٪", up: true }} />
        <Kpi label="ظرفیت ثبت‌شده" value={`${num1(stats.totalCapacityKw)} کیلووات`} hint="مجموع ظرفیت درخواست‌ها" icon="zap" trend={{ value: "۸٪", up: true }} />
        <Kpi label="وصول مالی" value={moneyShort(stats.revenue)} hint={`از ${moneyShort(stats.contractValue)} قرارداد`} icon="wallet" trend={{ value: "۵٪", up: true }} />
        <Kpi label="نیازمند توجه" value={faNum(alerts.length)} hint="متوقف، رد شده یا معوق" icon="alert" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="روند وصول درآمد" subtitle="میلیارد تومان — ۱۲ ماه اخیر" icon="trending" action={<Badge tone="success" dot>رشد پیوسته</Badge>} />
          <div className="p-4">
            <LineChart values={revenueSeries} labels={["فروردین", "خرداد", "مرداد", "مهر", "آذر", "اسفند"]} />
          </div>
        </Card>

        <Card>
          <CardHeader title="توزیع پروژه‌ها" subtitle="بر اساس مرحله چرخه عمر" icon="chart" />
          <div className="p-4">
            <Donut data={stageData.filter((d) => d.value > 0)} size={150} center={{ value: faNum(stats.totalProjects), label: "پروژه" }} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="ظرفیت به تفکیک مرحله" subtitle="کیلووات" icon="grid" />
          <div className="p-4">
            <BarChart
              data={stageData.map((s, i) => ({
                label: s.label,
                value: projects.filter((p) => p.stage === STAGES[i].key).reduce((sum, p) => sum + p.capacityKw, 0),
              }))}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="هشدارهای عملیاتی" subtitle="پروژه‌های متوقف، رد شده یا دارای پرداخت معوق" icon="alert" action={<Link to="/admin/projects" className="text-xs font-bold text-warn">همه پروژه‌ها</Link>} />
          <ul className="divide-y divide-line-soft">
            {alerts.slice(0, 5).map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-2 px-4 py-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-danger-soft text-danger"><Icon name="alert" size={14} /></span>
                <div className="min-w-0 flex-1">
                  <Link to={`/projects/${p.id}`} className="num text-xs font-bold hover:text-warn">{p.code}</Link>
                  <span className="mr-2 text-[0.65rem] text-muted">{p.applicantName}</span>
                </div>
                <Badge tone="danger">{p.subStage === "blocked" ? "متوقف" : p.subStage === "rejected" ? "رد شده" : "پرداخت معوق"}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="پروژه‌های اخیر" subtitle="آخرین تغییرات وضعیت" icon="folder" action={<Link to="/admin/projects" className="text-xs font-bold text-warn">مدیریت</Link>} />
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>کد</th>
                <th>متقاضی</th>
                <th className="hidden sm:table-cell">نصاب</th>
                <th>مرحله</th>
                <th className="hidden md:table-cell">پیشرفت</th>
                <th aria-label="جزئیات" />
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 6).map((p) => (
                <tr key={p.id}>
                  <td><Link to={`/projects/${p.id}`} className="num text-xs font-bold hover:text-warn">{p.code}</Link></td>
                  <td className="text-xs">{p.applicantName}</td>
                  <td className="hidden text-xs text-muted sm:table-cell">{p.installerName}</td>
                  <td className="text-xs">{stageLabel(p.stage)}</td>
                  <td className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={p.progress} className="w-16" tone={p.subStage === "blocked" ? "danger" : "accent"} />
                      <span className="num text-[0.65rem] text-muted">{percent(p.progress)}</span>
                    </div>
                  </td>
                  <td><Link to={`/projects/${p.id}`} className="btn btn-ghost btn-sm">جزئیات</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

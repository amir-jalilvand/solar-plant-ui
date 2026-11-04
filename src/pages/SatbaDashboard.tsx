import { Link } from "react-router-dom";
import { Badge, Card, CardHeader, ErrorState, Kpi, PageHeader, ProgressBar, SkeletonCard } from "../components/ui";
import { Icon } from "../components/Icon";
import { Donut } from "../components/Charts";
import { useMockQuery } from "../lib/demo";
import { projects, stats } from "../lib/data";
import { faNum, moneyShort, num1 } from "../lib/format";
import { stageLabel } from "../lib/labels";

export default function SatbaDashboard() {
  const q = useMockQuery(() => ({ projects, stats }), []);
  if (q.status === "loading") {
    return <div className="grid gap-3 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>;
  }
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const cityTotals = projects.reduce<Record<string, { count: number; kw: number }>>((acc, p) => {
    acc[p.city] = acc[p.city] ?? { count: 0, kw: 0 };
    acc[p.city].count += 1;
    acc[p.city].kw += p.capacityKw;
    return acc;
  }, {});
  const provinceRows = Object.entries(cityTotals)
    .map(([city, v]) => ({ city, ...v }))
    .sort((a, b) => b.kw - a.kw)
    .slice(0, 6);
  const maxKw = Math.max(...provinceRows.map((p) => p.kw), 1);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-info/30 bg-info-soft/50 px-4 py-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-info">
          <Icon name="eye" size={15} /> دسترسی شما فقط مشاهده است؛ هیچ دکمه ویرایش یا تأیید در این پنل وجود ندارد.
        </p>
        <Badge tone="info" dot>اتصال داده: نمایشی (Mock)</Badge>
      </div>

      <PageHeader title="داشبورد نظارتی ساتبا" subtitle="نمای کلان عملکرد سکو، ظرفیت و وضعیت مالی پروژه‌ها" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="پروژه‌های تحت نظارت" value={faNum(stats.totalProjects)} icon="folder" hint="همه استان‌ها" />
        <Kpi label="ظرفیت کل" value={`${num1(stats.totalCapacityKw)} کیلووات`} icon="zap" hint="ظرفیت ثبت‌شده" />
        <Kpi label="ارزش قراردادها" value={moneyShort(stats.contractValue)} icon="wallet" hint="تجمیع سکو" />
        <Kpi label="پروژه‌های متوقف" value={faNum(projects.filter((p) => p.subStage === "blocked").length)} icon="alert" hint="نیازمند پیگیری" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="پروژه‌ها به تفکیک مرحله" subtitle="کل پروژه‌های ثبت‌شده در سکو" icon="chart" />
          <div className="p-4">
            <Donut data={stats.byStage.filter((s) => s.value > 0)} size={160} center={{ value: faNum(stats.totalProjects), label: "پروژه" }} />
          </div>
        </Card>

        <Card>
          <CardHeader title="ظرفیت به تفکیک استان" subtitle="کیلووات" icon="pin" />
          <ul className="space-y-3 p-4">
            {provinceRows.map((p) => (
              <li key={p.city}>
                <div className="mb-1 flex justify-between text-[0.7rem]">
                  <span>{p.city} <span className="text-muted">— {faNum(p.count)} پروژه</span></span>
                  <span className="num font-bold">{num1(p.kw)}</span>
                </div>
                <ProgressBar value={(p.kw / maxKw) * 100} tone="info" />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="آخرین پروژه‌های ثبت‌شده" subtitle="نمایش خواندنی" icon="folder" action={<Link to="/satba/projects" className="text-xs font-bold text-warn">فهرست کامل</Link>} />
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>کد</th>
                <th>استان</th>
                <th className="hidden sm:table-cell">ظرفیت</th>
                <th>مرحله</th>
                <th className="hidden md:table-cell">وضعیت مالی</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(-6).reverse().map((p) => (
                <tr key={p.id}>
                  <td className="num text-xs font-bold">{p.code}</td>
                  <td className="text-xs">{p.city}</td>
                  <td className="num hidden text-xs sm:table-cell">{num1(p.capacityKw)} کیلووات</td>
                  <td className="text-xs text-muted">{stageLabel(p.stage)}</td>
                  <td className="hidden md:table-cell">
                    <Badge tone={p.paid >= p.amount * 0.7 ? "success" : p.paid > 0 ? "warn" : "neutral"}>
                      {p.paid >= p.amount * 0.7 ? "تسویه عمده" : p.paid > 0 ? "در حال پرداخت" : "بدون پرداخت"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

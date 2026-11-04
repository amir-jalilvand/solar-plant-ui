import { Button, Card, CardHeader, ErrorState, Kpi, PageHeader, SkeletonCard } from "../components/ui";
import { BarChart, Donut, LineChart } from "../components/Charts";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { projects, stats } from "../lib/data";
import { faNum, moneyShort, num1 } from "../lib/format";

const monthly = [
  { month: "فروردین", projects: 6, capacity: 120 },
  { month: "اردیبهشت", projects: 9, capacity: 185 },
  { month: "خرداد", projects: 7, capacity: 140 },
  { month: "تیر", projects: 12, capacity: 260 },
  { month: "مرداد", projects: 11, capacity: 230 },
  { month: "شهریور", projects: 14, capacity: 310 },
];

export default function AdminReports() {
  const q = useMockQuery(() => ({ projects, stats, monthly }), []);
  if (q.status === "loading") return <div className="grid gap-3 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  return (
    <div>
      <PageHeader
        title="گزارش‌های عملکرد و مالی"
        subtitle="شاخص‌های کلیدی سکو به تفکیک زمان و استان"
        actions={<Button variant="accent" icon="download">خروجی اکسل</Button>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="پروژه‌های ثبت‌شده" value={faNum(stats.totalProjects)} icon="folder" />
        <Kpi label="ظرفیت کل" value={`${num1(stats.totalCapacityKw)} کیلووات`} icon="zap" />
        <Kpi label="ارزش قرارداد" value={moneyShort(stats.contractValue)} icon="wallet" />
        <Kpi label="رضایت میانگین" value={`${num1(stats.avgSatisfaction)} از ۵`} icon="star" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="روند ثبت پروژه" subtitle="شش ماه اخیر" icon="trending" />
          <div className="p-4">
            <LineChart values={monthly.map((m) => m.projects)} labels={monthly.map((m) => m.month)} />
          </div>
        </Card>
        <Card>
          <CardHeader title="توزیع مرحله‌ها" subtitle="کل پروژه‌ها" icon="chart" />
          <div className="p-4">
            <Donut data={stats.byStage.filter((s) => s.value > 0)} size={150} center={{ value: faNum(stats.totalProjects), label: "پروژه" }} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="ظرفیت ماهانه" subtitle="کیلووات نصب‌شده" icon="grid" />
          <div className="p-4">
            <BarChart data={monthly.map((m) => ({ label: m.month, value: m.capacity }))} />
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="خلاصه عملکردی" subtitle="مقایسه شاخص‌ها" icon="chart" action={<Button size="sm" variant="ghost" icon="download">PDF</Button>} />
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>شاخص</th>
                  <th>مقدار</th>
                  <th className="hidden sm:table-cell">تغییر</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["میانگین زمان اجرا", "۴۶ روز", "−۴ روز"],
                  ["نرخ تحویل به‌موقع", "۸۲٪", "+۵٪"],
                  ["میانگین امتیاز نصابان", "۴٫۱", "+۰٫۲"],
                  ["نرخ شکایت", "۳٪", "−۱٪"],
                  ["پروژه‌های متوقف", faNum(projects.filter((p) => p.subStage === "blocked").length), "—"],
                ].map(([k, v, d]) => (
                  <tr key={k}>
                    <td className="text-xs">{k}</td>
                    <td className="num text-xs font-bold">{v}</td>
                    <td className={`hidden text-xs sm:table-cell ${d.startsWith("−") ? "text-success" : d === "—" ? "text-muted" : "text-success"}`}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-3">
        <p className="flex items-center gap-1.5 text-[0.7rem] text-muted">
          <Icon name="file" size={13} /> خروجی‌ها در نسخه دمو شبیه‌سازی شده‌اند؛ در نسخه واقعی فایل اکسل و PDF تولید و در مرکز اعلان قابل دریافت است.
        </p>
      </Card>
    </div>
  );
}

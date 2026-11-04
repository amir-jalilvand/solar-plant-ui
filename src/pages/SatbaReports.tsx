import { Badge, Button, Card, CardHeader, ErrorState, Kpi, PageHeader, SkeletonCard } from "../components/ui";
import { BarChart, LineChart } from "../components/Charts";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { projects, stats } from "../lib/data";
import { faNum, moneyShort, num1 } from "../lib/format";

export default function SatbaReports() {
  const q = useMockQuery(() => ({ projects, stats }), []);
  if (q.status === "loading") return <div className="grid gap-3 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const capacityByMonth = [180, 240, 210, 320, 290, 410, 380, 460];

  return (
    <div>
      <PageHeader
        title="گزارش عملکرد"
        subtitle="شاخص‌های نظارتی برای ساتبا — ظرفیت، پیشرفت و وضعیت مالی"
        actions={<Button variant="ghost" icon="download">دریافت خروجی</Button>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="ظرفیت نصب‌شده" value={`${num1(stats.totalCapacityKw)} کیلووات`} icon="zap" hint="مجموع پروژه‌ها" />
        <Kpi label="میانگین پیشرفت" value={`${faNum(Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length))}٪`} icon="trending" hint="کل پروژه‌ها" />
        <Kpi label="ارزش قرارداد" value={moneyShort(stats.contractValue)} icon="wallet" hint="تجمیع سکو" />
        <Kpi label="درصد وصول" value={`${faNum(Math.round((stats.revenue / stats.contractValue) * 100))}٪`} icon="chart" hint="نسبت به ارزش قرارداد" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="روند ظرفیت ماهانه" subtitle="کیلووات — ۸ ماه اخیر" icon="trending" />
          <div className="p-4">
            <LineChart values={capacityByMonth} labels={["فرو", "ارد", "خرد", "تیر", "مرد", "شهر", "مهر", "آبا"]} />
          </div>
        </Card>

        <Card>
          <CardHeader title="وضعیت پروژه‌ها" subtitle="به تفکیک مرحله" icon="chart" />
          <div className="p-4">
            <BarChart data={stats.byStage} height={170} />
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <CardHeader title="جدول شاخص‌های استانی" subtitle="نمونه داده نمایشی" icon="pin" action={<Badge tone="info">Mock</Badge>} />
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>استان</th>
                <th>تعداد پروژه</th>
                <th>ظرفیت (کیلووات)</th>
                <th className="hidden sm:table-cell">میانگین پیشرفت</th>
                <th className="hidden md:table-cell">نرخ وصول</th>
              </tr>
            </thead>
            <tbody>
              {["تهران", "اصفهان", "فارس", "یزد", "خوزستان", "مازندران"].map((city, i) => {
                const list = projects.filter((p) => p.city === city);
                return (
                  <tr key={city}>
                    <td className="text-xs font-semibold">{city}</td>
                    <td className="num text-xs">{faNum(list.length)}</td>
                    <td className="num text-xs">{num1(list.reduce((s, p) => s + p.capacityKw, 0))}</td>
                    <td className="hidden text-xs sm:table-cell">{faNum(list.length ? Math.round(list.reduce((s, p) => s + p.progress, 0) / list.length) : 0)}٪</td>
                    <td className="hidden text-xs md:table-cell">{faNum(58 + i * 6)}٪</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-3 flex items-center gap-1.5 text-[0.7rem] text-muted">
        <Icon name="shield" size={13} /> این گزارش‌ها فقط برای نظارت است و امکان تغییر داده در پنل ساتبا وجود ندارد.
      </p>
    </div>
  );
}

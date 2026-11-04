import { Badge, Card, CardHeader, ErrorState, PageHeader, ProgressBar, SkeletonTable } from "../components/ui";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { installers } from "../lib/data";
import { faNum, num1 } from "../lib/format";

export default function AdminEvaluation() {
  const q = useMockQuery(() => installers, []);
  if (q.status === "loading") return <Card><SkeletonTable rows={5} /></Card>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const ranked = [...(q.data ?? [])].sort((a, b) => b.score - a.score);

  return (
    <div>
      <PageHeader title="ارزیابی نصابان" subtitle="رتبه‌بندی بر اساس کیفیت اجرا، تحویل به‌موقع و رضایت متقاضی" />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted">میانگین امتیاز نصابان</p>
          <p className="num mt-1 text-2xl font-extrabold">{num1(ranked.reduce((s, i) => s + i.score, 0) / ranked.length)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">میانگین نرخ رد مدارک</p>
          <p className="num mt-1 text-2xl font-extrabold text-danger">{faNum(Math.round(ranked.reduce((s, i) => s + i.rejectionRate, 0) / ranked.length))}٪</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">میانگین زمان تحویل</p>
          <p className="num mt-1 text-2xl font-extrabold">{faNum(Math.round(ranked.reduce((s, i) => s + i.avgHandoverDays, 0) / ranked.length))} روز</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="رتبه‌بندی نصابان" subtitle="معیارها: امتیاز کیفیت، نرخ رد مدارک، زمان تحویل" icon="star" />
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>رتبه</th>
                <th>شرکت</th>
                <th>امتیاز</th>
                <th className="hidden sm:table-cell">نرخ رد مدارک</th>
                <th className="hidden md:table-cell">زمان تحویل</th>
                <th className="hidden lg:table-cell">پروژه فعال</th>
                <th>وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((ins, i) => (
                <tr key={ins.id}>
                  <td>
                    <span className={`grid size-6 place-items-center rounded-full text-[0.7rem] font-bold ${i === 0 ? "bg-accent text-[#1a1205]" : "bg-line-soft text-muted"}`}>{faNum(i + 1)}</span>
                  </td>
                  <td>
                    <p className="text-xs font-bold">{ins.name}</p>
                    <p className="text-[0.6rem] text-muted">{ins.regions.join(" / ")}</p>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={ins.score * 20} className="w-14" />
                      <span className="num text-xs font-bold">{num1(ins.score)}</span>
                    </div>
                  </td>
                  <td className="num hidden text-xs sm:table-cell">{faNum(ins.rejectionRate)}٪</td>
                  <td className="num hidden text-xs md:table-cell">{faNum(ins.avgHandoverDays)} روز</td>
                  <td className="num hidden text-xs lg:table-cell">{faNum(ins.activeProjects)}</td>
                  <td>
                    <Badge tone={ins.score >= 4.4 ? "success" : ins.score >= 3.8 ? "warn" : "danger"} dot>
                      {ins.score >= 4.4 ? "ممتاز" : ins.score >= 3.8 ? "قابل قبول" : "نیازمند اصلاح"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-3 flex items-center gap-1.5 text-[0.7rem] text-muted">
        <Icon name="alert" size={13} /> نصابانی که دو دوره متوالی امتیاز زیر ۳٫۵ بگیرند، به‌صورت خودکار از چرخه تخصیص خارج می‌شوند (قاعده پیشنهادی، قابل تنظیم).
      </p>
    </div>
  );
}

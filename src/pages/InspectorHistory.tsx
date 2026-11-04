import { Link } from "react-router-dom";
import { Badge, Card, ErrorState, PageHeader, SkeletonTable } from "../components/ui";
import { useMockQuery } from "../lib/demo";
import { projects, tests } from "../lib/data";
import { faNum, jalali } from "../lib/format";
import { stageLabel } from "../lib/labels";

export default function InspectorHistory() {
  const q = useMockQuery(() => projects.filter((p) => ["testing", "handover", "after_sales"].includes(p.stage)), []);
  if (q.status === "loading") return <Card><SkeletonTable rows={5} /></Card>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  return (
    <div>
      <PageHeader title="سابقه بررسی‌ها" subtitle="پروژه‌هایی که مراحل آزمون و تأیید را گذرانده‌اند" />
      <Card className="overflow-hidden">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>پروژه</th>
                <th>متقاضی</th>
                <th>مرحله</th>
                <th className="hidden sm:table-cell">آزمون‌ها</th>
                <th className="hidden md:table-cell">تاریخ</th>
                <th aria-label="جزئیات" />
              </tr>
            </thead>
            <tbody>
              {(q.data ?? []).map((p) => {
                const mine = tests.filter((t) => t.projectId === p.id);
                return (
                  <tr key={p.id}>
                    <td><Link to={`/projects/${p.id}`} className="num text-xs font-bold hover:text-warn">{p.code}</Link></td>
                    <td className="text-xs">{p.applicantName}</td>
                    <td className="text-xs text-muted">{stageLabel(p.stage)}</td>
                    <td className="hidden sm:table-cell">
                      <div className="flex gap-1">
                        {mine.map((t) => (
                          <Badge key={t.id} tone={t.result === "pass" ? "success" : t.result === "fail" ? "danger" : "warn"}>{t.result === "pass" ? "قبول" : t.result === "fail" ? "رد" : "در انتظار"}</Badge>
                        ))}
                        {mine.length === 0 ? <span className="text-[0.65rem] text-muted">—</span> : null}
                      </div>
                    </td>
                    <td className="hidden text-xs text-muted md:table-cell">{jalali(p.updatedAt)}</td>
                    <td className="text-left"><Link to={`/projects/${p.id}`} className="btn btn-ghost btn-sm">{faNum(1)} پرونده</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

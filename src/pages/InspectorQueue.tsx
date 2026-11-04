import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, EmptyState, ErrorState, Kpi, PageHeader, SearchBox, Select, SkeletonTable } from "../components/ui";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { documentsOf, testsOf, waitingReviewProjects } from "../lib/data";
import { faNum, jalali, relative } from "../lib/format";
import { stageLabel } from "../lib/labels";

export default function InspectorQueue() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const q = useMockQuery(() => waitingReviewProjects(), []);

  if (q.status === "loading") return <Card><SkeletonTable rows={6} /></Card>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const list = (q.data ?? []).filter((p) => {
    const match = !query || p.code.includes(query) || p.applicantName.includes(query);
    return match;
  });

  return (
    <div>
      <PageHeader title="صف بررسی" subtitle="مدارک و آزمون‌های منتظر تأیید یا رد، به‌ترتیب اولویت" />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Kpi label="در انتظار بررسی" value={faNum(list.length)} icon="clock" hint="مرتب‌شده بر اساس قدمت" />
        <Kpi label="مدارک باز" value={faNum(list.reduce((s, p) => s + documentsOf(p.id).filter((d) => d.status === "pending").length, 0))} icon="file" hint="نیازمند تصمیم" />
        <Kpi label="آزمون‌های باز" value={faNum(list.reduce((s, p) => s + testsOf(p.id).filter((t) => t.result === "pending").length, 0))} icon="shield" hint="آزمون فنی" />
      </div>

      <Card className="mb-3 flex flex-wrap items-center gap-2 p-3">
        <SearchBox value={query} onChange={setQuery} placeholder="جست‌وجوی کد یا متقاضی…" className="w-full sm:w-64" />
        <Select value={kind} onChange={(e) => setKind(e.target.value)} className="w-auto text-xs" aria-label="نوع بررسی">
          <option value="all">همه انواع</option>
          <option value="documents">مدارک</option>
          <option value="tests">آزمون</option>
        </Select>
        <span className="mr-auto text-[0.7rem] text-muted">{faNum(list.length)} مورد در صف</span>
      </Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <EmptyState icon="checkCircle" title="صف بررسی خالی است" description="همه مدارک و آزمون‌ها بررسی شده‌اند." />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>پروژه</th>
                  <th>متقاضی</th>
                  <th className="hidden sm:table-cell">مرحله</th>
                  <th>نوع بررسی</th>
                  <th className="hidden md:table-cell">قدمت</th>
                  <th aria-label="عملیات" />
                </tr>
              </thead>
              <tbody>
                {list.map((p) => {
                  const pendingDocs = documentsOf(p.id).filter((d) => d.status === "pending");
                  const pendingTests = testsOf(p.id).filter((t) => t.result === "pending");
                  const showDocs = kind !== "tests" && pendingDocs.length > 0;
                  const showTests = kind !== "documents" && pendingTests.length > 0;
                  if (!showDocs && !showTests) return null;
                  return (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/projects/${p.id}`} className="num text-xs font-bold hover:text-warn">{p.code}</Link>
                        <p className="text-[0.65rem] text-muted">{p.city}</p>
                      </td>
                      <td className="text-xs">{p.applicantName}</td>
                      <td className="hidden text-xs sm:table-cell">{stageLabel(p.stage)}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {showDocs ? <Badge tone="warn">{faNum(pendingDocs.length)} مدرک</Badge> : null}
                          {showTests ? <Badge tone="info">{faNum(pendingTests.length)} آزمون</Badge> : null}
                        </div>
                      </td>
                      <td className="hidden text-[0.7rem] text-muted md:table-cell">{relative(p.updatedAt)}</td>
                      <td>
                        <Link to={`/inspector/review/${p.id}`} className="btn btn-primary btn-sm">بررسی</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="mt-3 flex items-center gap-1.5 text-[0.7rem] text-muted">
        <Icon name="shield" size={13} /> هر اقدام تأیید یا رد، دلیل اجباری دارد و در تاریخچه پروژه ثبت می‌شود.
      </p>
      <p className="mt-1 text-[0.65rem] text-muted">آخرین به‌روزرسانی صف: {jalali(new Date().toISOString())}</p>
    </div>
  );
}

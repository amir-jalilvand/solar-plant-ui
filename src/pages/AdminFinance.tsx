import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, CardHeader, ErrorState, Kpi, PageHeader, SearchBox, Select, SkeletonTable } from "../components/ui";
import { Donut } from "../components/Charts";
import { useMockQuery } from "../lib/demo";
import { payments, projects, stats } from "../lib/data";
import { faNum, jalali, money, moneyShort } from "../lib/format";
import { PAYMENT_STATUS } from "../lib/labels";

export default function AdminFinance() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const q = useMockQuery(() => ({ payments, projects, stats }), []);

  const rows = useMemo(() => {
    const list = q.data?.payments ?? [];
    return list.filter((p) => {
      const project = q.data?.projects.find((x) => x.id === p.projectId);
      const match = !query || (project?.code.includes(query) ?? false) || (project?.applicantName.includes(query) ?? false);
      return match && (status === "all" || p.status === status);
    });
  }, [q.data, query, status]);

  if (q.status === "loading") return <Card><SkeletonTable rows={7} /></Card>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const data = q.data!;
  const collected = data.payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const overdue = data.payments.filter((p) => p.status === "overdue");
  const upcoming = data.payments.filter((p) => p.status === "due" || p.status === "scheduled").reduce((s, p) => s + p.amount, 0);
  const donut = [
    { label: "پرداخت‌شده", value: data.payments.filter((p) => p.status === "paid").length },
    { label: "سررسید", value: data.payments.filter((p) => p.status === "due").length },
    { label: "معوق", value: data.payments.filter((p) => p.status === "overdue").length },
    { label: "زمان‌بندی", value: data.payments.filter((p) => p.status === "scheduled").length },
  ];

  return (
    <div>
      <PageHeader title="مالی، قرارداد و پرداخت" subtitle="وضعیت وصول، اقساط و پرداخت‌های معوق" />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="ارزش قراردادها" value={moneyShort(stats.contractValue)} icon="file" />
        <Kpi label="وصول‌شده" value={moneyShort(collected)} hint={`${faNum(Math.round((collected / stats.contractValue) * 100))}٪ از کل`} icon="wallet" trend={{ value: "۶٪", up: true }} />
        <Kpi label="در انتظار وصول" value={moneyShort(upcoming)} hint="اقساط سررسید و آینده" icon="clock" />
        <Kpi label="پرداخت معوق" value={faNum(overdue.length)} hint={moneyShort(overdue.reduce((s, p) => s + p.amount, 0))} icon="alert" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div>
          <Card className="mb-3 flex flex-wrap items-center gap-2 p-3">
            <SearchBox value={query} onChange={setQuery} placeholder="کد پروژه یا متقاضی…" className="w-full sm:w-64" />
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto text-xs" aria-label="وضعیت پرداخت">
              <option value="all">همه وضعیت‌ها</option>
              <option value="paid">پرداخت‌شده</option>
              <option value="due">سررسید</option>
              <option value="overdue">معوق</option>
              <option value="scheduled">زمان‌بندی‌شده</option>
            </Select>
            <span className="mr-auto text-[0.7rem] text-muted">{faNum(rows.length)} قسط</span>
          </Card>

          <Card className="overflow-hidden">
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>پروژه</th>
                    <th>عنوان قسط</th>
                    <th>مبلغ</th>
                    <th className="hidden sm:table-cell">سررسید</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 14).map((p) => {
                    const project = data.projects.find((x) => x.id === p.projectId);
                    const meta = PAYMENT_STATUS[p.status];
                    return (
                      <tr key={p.id}>
                        <td>
                          <Link to={`/projects/${p.projectId}`} className="num text-xs font-bold hover:text-warn">{project?.code}</Link>
                          <p className="text-[0.6rem] text-muted">{project?.applicantName}</p>
                        </td>
                        <td className="text-xs">{p.title}</td>
                        <td className="num text-xs">{money(p.amount)}</td>
                        <td className="hidden text-xs text-muted sm:table-cell">{jalali(p.dueDate)}</td>
                        <td><Badge tone={meta.tone} dot>{meta.label}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <aside className="space-y-3">
          <Card>
            <CardHeader title="وضعیت اقساط" subtitle="تعداد به تفکیک وضعیت" icon="wallet" />
            <div className="p-4">
              <Donut data={donut} size={140} thickness={14} center={{ value: faNum(data.payments.length), label: "قسط" }} />
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold">اقدام لازم</p>
            <p className="mt-1 text-[0.7rem] leading-6 text-muted">برای اقساط معوق، ارسال یادآوری پیامکی و اعلان به متقاضی ثبت می‌شود.</p>
            <button type="button" className="btn btn-accent btn-sm mt-2 w-full">ارسال یادآوری گروهی</button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

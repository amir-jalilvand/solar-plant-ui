import { Link } from "react-router-dom";
import { Badge, Button, Card, CardHeader, EmptyState, ErrorState, PageHeader, Skeleton, SkeletonTable, Tabs } from "../components/ui";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { applicantName, contractOf, paymentsOf, projectsOfApplicant } from "../lib/data";
import { jalali, money, moneyShort } from "../lib/format";
import { PAYMENT_STATUS, stageLabel } from "../lib/labels";
import { useState } from "react";

export default function ApplicantFinance() {
  const [tab, setTab] = useState<"overview" | "installments">("overview");
  const q = useMockQuery(() => {
    const list = projectsOfApplicant(applicantName);
    return list.map((p) => ({
      project: p,
      contract: contractOf(p.id),
      payments: paymentsOf(p.id),
    }));
  }, []);

  if (q.status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Card><SkeletonTable rows={4} /></Card>
      </div>
    );
  }
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const rows = q.data ?? [];

  return (
    <div>
      <PageHeader title="قرارداد، تسهیلات و پرداخت" subtitle="وضعیت قرارداد، برنامه اقساط و سابقه پرداخت‌ها" />

      {q.isEmpty || rows.length === 0 ? (
        <Card>
          <EmptyState icon="wallet" title="قراردادی ثبت نشده است" description="پس از تأیید درخواست، قرارداد و برنامه اقساط در این صفحه نمایش داده می‌شود." />
        </Card>
      ) : (
        <div className="space-y-4">
          <Tabs
            items={[
              { key: "overview", label: "نمای کلی قرارداد" },
              { key: "installments", label: "برنامه اقساط", count: rows.reduce((s, r) => s + r.payments.length, 0) },
            ]}
            value={tab}
            onChange={setTab}
          />

          {tab === "overview" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {rows.map(({ project, contract, payments }) => {
                const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
                const remaining = project.amount - paid;
                return (
                  <Card key={project.id}>
                    <CardHeader
                      title={<Link to={`/projects/${project.id}`} className="num hover:text-warn">{project.code}</Link>}
                      subtitle={`${stageLabel(project.stage)} — ${project.city}`}
                      icon="file"
                      action={<Badge tone={contract?.status === "signed" ? "success" : "warn"} dot>{contract?.status === "signed" ? "امضا شده" : "در انتظار امضا"}</Badge>}
                    />
                    <div className="space-y-3 p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-bg/70 p-3">
                          <p className="text-[0.65rem] text-muted">مبلغ قرارداد</p>
                          <p className="num mt-0.5 text-sm font-extrabold">{money(project.amount)}</p>
                        </div>
                        <div className="rounded-xl bg-bg/70 p-3">
                          <p className="text-[0.65rem] text-muted">مانده بدهی</p>
                          <p className="num mt-0.5 text-sm font-extrabold text-warn">{money(remaining)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-line-soft px-3 py-2 text-xs">
                        <span className="flex items-center gap-1.5 text-muted"><Icon name="file" size={14} /> فایل قرارداد</span>
                        <Button variant="ghost" size="sm" icon="eye">مشاهده پیش‌نمایش</Button>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-line-soft px-3 py-2 text-xs">
                        <span className="flex items-center gap-1.5 text-muted"><Icon name="wallet" size={14} /> منبع تسهیلات</span>
                        <span className="font-semibold">بانک عامل — طرح حمایتی ساتبا</span>
                      </div>
                      <p className="text-[0.7rem] leading-6 text-muted">
                        امضای قرارداد در این نسخه به‌صورت نمایش فایل و بارگذاری نسخه امضاشده است؛ اتصال به سامانه امضای الکترونیک در فاز بعدی اضافه می‌شود.
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {rows.map(({ project, payments }) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader title={<span className="num">{project.code}</span>} subtitle={`${project.applicantName} — ${project.city}`} icon="wallet" action={<span className="text-[0.7rem] text-muted">{moneyShort(project.amount)}</span>} />
                  <div className="table-wrap">
                    <table className="data">
                      <thead>
                        <tr>
                          <th>عنوان قسط</th>
                          <th>مبلغ</th>
                          <th>سررسید</th>
                          <th>تاریخ پرداخت</th>
                          <th>وضعیت</th>
                          <th aria-label="عملیات" />
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => {
                          const meta = PAYMENT_STATUS[p.status];
                          return (
                            <tr key={p.id}>
                              <td className="text-xs font-semibold">{p.title}</td>
                              <td className="num text-xs">{money(p.amount)}</td>
                              <td className="text-xs text-muted">{jalali(p.dueDate)}</td>
                              <td className="text-xs text-muted">{p.paidAt ? jalali(p.paidAt) : "—"}</td>
                              <td><Badge tone={meta.tone} dot>{meta.label}</Badge></td>
                              <td>
                                {p.status === "overdue" || p.status === "due" ? (
                                  <Button size="sm" variant="accent">پرداخت</Button>
                                ) : (
                                  <span className="text-[0.65rem] text-muted">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}
              <p className="text-center text-[0.7rem] text-muted">مبالغ به تومان است. پرداخت آنلاین در نسخه دمو شبیه‌سازی شده است.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

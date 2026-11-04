import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, Card, EmptyState, Field, Modal, PageHeader, ProgressBar, Tabs, Textarea, cn } from "../components/ui";
import { Icon } from "../components/Icon";
import { ProjectStepper } from "../components/ProjectStepper";
import { Timeline } from "../components/Timeline";
import { useToast } from "../components/Toast";
import { useRole } from "../lib/role";
import { contractOf, documentsOf, equipmentOf, eventsOf, feedbackOf, paymentsOf, projectById, reportsOf, testsOf, ticketsOf } from "../lib/data";
import { faNum, jalali, jalaliTime, money, num1, percent } from "../lib/format";
import { DOC_TYPE_LABEL, PAYMENT_STATUS, stageLabel } from "../lib/labels";
import type { DocFile } from "../lib/types";

type TabKey = "summary" | "documents" | "equipment" | "progress" | "payments" | "history" | "tickets";

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projectById(id);
  const { role } = useRole();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabKey>("summary");
  const [docs, setDocs] = useState<DocFile[]>(() => (project ? documentsOf(project.id) : []));
  const [rejectDoc, setRejectDoc] = useState<DocFile | null>(null);
  const [reason, setReason] = useState("");

  if (!project) {
    return (
      <Card>
        <EmptyState icon="alert" title="پروژه یافت نشد" description="کد پروژه معتبر نیست یا دسترسی به آن ندارید." action={<Link to="/" className="btn btn-primary">بازگشت به داشبورد</Link>} />
      </Card>
    );
  }

  const contract = contractOf(project.id);
  const payments = paymentsOf(project.id);
  const equipment = equipmentOf(project.id);
  const reports = reportsOf(project.id);
  const events = eventsOf(project.id);
  const tests = testsOf(project.id);
  const tickets = ticketsOf(project.id);
  const fb = feedbackOf(project.id);
  const readOnly = role === "satba";
  const pendingDocs = docs.filter((d) => d.status === "pending").length;

  const approve = (doc: DocFile) => {
    setDocs((list) => list.map((d) => (d.id === doc.id ? { ...d, status: "approved", rejectReason: undefined } : d)));
    toast(`مدرک «${DOC_TYPE_LABEL[doc.type] ?? doc.type}» تأیید شد.`);
  };

  const reject = () => {
    if (!rejectDoc || reason.trim().length < 5) return;
    setDocs((list) => list.map((d) => (d.id === rejectDoc.id ? { ...d, status: "rejected", rejectReason: reason } : d)));
    toast("مدرک رد شد و دلیل برای بارگذار ثبت گردید.", "danger");
    setRejectDoc(null);
    setReason("");
  };

  return (
    <div>
      <PageHeader
        title={project.code}
        subtitle={`${project.applicantName} — ${project.city}`}
        back={
          <Link to={role === "applicant" ? "/applicant/projects" : role === "installer" ? "/installer/projects" : role === "inspector" ? "/inspector" : role === "satba" ? "/satba/projects" : "/admin/projects"} className="mb-1 inline-flex items-center gap-1 text-xs text-muted hover:text-ink">
            <Icon name="chevronRight" size={13} /> بازگشت به فهرست
          </Link>
        }
        actions={
          <>
            {!readOnly ? (
              <Button variant="ghost" icon="message">گفت‌وگو</Button>
            ) : (
              <Badge tone="info" dot>دسترسی خواندنی</Badge>
            )}
            {!readOnly && role !== "applicant" ? <Button variant="accent" icon="check">اقدام مرحله</Button> : null}
          </>
        }
      />

      <Card className="mb-4 overflow-hidden">
        <div className="grid gap-3 border-b border-line-soft p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[0.65rem] text-muted">مرحله فعلی</p>
            <p className="mt-0.5 text-sm font-bold">{stageLabel(project.stage)}</p>
          </div>
          <div>
            <p className="text-[0.65rem] text-muted">وضعیت</p>
            <div className="mt-1">
              <Badge tone={project.subStage === "blocked" || project.subStage === "rejected" ? "danger" : project.subStage === "approved" ? "success" : project.subStage === "waiting_review" ? "warn" : "info"} dot>
                {project.subStage === "blocked" ? "متوقف" : project.subStage === "rejected" ? "رد شده" : project.subStage === "approved" ? "تأیید شده" : project.subStage === "waiting_review" ? "منتظر بررسی" : project.subStage === "not_started" ? "شروع نشده" : "در حال انجام"}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-[0.65rem] text-muted">ظرفیت</p>
            <p className="num mt-0.5 text-sm font-bold">{num1(project.capacityKw)} کیلووات</p>
          </div>
          <div>
            <p className="text-[0.65rem] text-muted">نصاب</p>
            <p className="mt-0.5 truncate text-sm font-bold">{project.installerName}</p>
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[1fr_18rem]">
          <div>
            <ProjectStepper project={project} />
          </div>
          <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-3">
            <p className="flex items-center gap-1.5 text-xs font-extrabold"><Icon name="zap" size={14} /> اقدام بعدی</p>
            <p className="mt-1.5 text-xs leading-6">{project.nextAction}</p>
            <div className="mt-2 flex items-center justify-between">
              <Badge tone="warn">{project.nextActionOwner}</Badge>
              <span className="text-[0.65rem] text-muted">آخرین به‌روزرسانی: {jalali(project.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-line-soft px-4 py-2.5">
          <ProgressBar value={project.progress} tone={project.subStage === "blocked" ? "danger" : "accent"} />
          <span className="num shrink-0 text-[0.7rem] font-bold text-muted">{percent(project.progress)}</span>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { key: "summary", label: "خلاصه" },
            { key: "documents", label: "مدارک", count: docs.length },
            { key: "equipment", label: "تجهیزات", count: equipment.length },
            { key: "progress", label: "گزارش پیشرفت", count: reports.length },
            { key: "payments", label: "پرداخت‌ها", count: payments.length },
            { key: "history", label: "تاریخچه" },
            { key: "tickets", label: "تیکت‌ها", count: tickets.length },
          ]}
        />

        <div className="p-4">
          {tab === "summary" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-xl border border-line-soft p-3">
                  <p className="mb-2 text-xs font-bold">مشخصات پروژه</p>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    {[
                      ["متقاضی", project.applicantName],
                      ["نوع متقاضی", project.applicantType],
                      ["شهر", project.city],
                      ["نشانی", project.address],
                      ["ظرفیت", `${num1(project.capacityKw)} کیلووات`],
                      ["تاریخ ثبت", jalali(project.createdAt)],
                      ["مبلغ قرارداد", money(project.amount)],
                      ["پرداخت‌شده", money(project.paid)],
                    ].map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-muted">{k}</dt>
                        <dd className={cn("font-semibold", k === "نشانی" && "col-span-1 truncate")} title={v}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-xl border border-line-soft p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold">
                    <Icon name="file" size={14} /> وضعیت مدارک
                    {pendingDocs > 0 ? <Badge tone="warn">{faNum(pendingDocs)} در انتظار</Badge> : <Badge tone="success">تکمیل</Badge>}
                  </p>
                  <ul className="space-y-1.5 text-xs">
                    {docs.slice(0, 5).map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-2">
                        <span className="truncate text-muted">{DOC_TYPE_LABEL[d.type] ?? d.type}</span>
                        <Badge tone={d.status === "approved" ? "success" : d.status === "rejected" ? "danger" : "warn"}>{d.status === "approved" ? "تأیید" : d.status === "rejected" ? "رد" : "بررسی"}</Badge>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => setTab("documents")} className="mt-2 text-[0.7rem] font-bold text-warn">مشاهده همه مدارک</button>
                </div>

                {tests.length > 0 ? (
                  <div className="rounded-xl border border-line-soft p-3">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold"><Icon name="shield" size={14} /> آزمون‌ها</p>
                    <ul className="space-y-1.5 text-xs">
                      {tests.map((t) => (
                        <li key={t.id} className="flex items-center justify-between gap-2">
                          <span className="truncate text-muted">{t.type}</span>
                          <Badge tone={t.result === "pass" ? "success" : t.result === "fail" ? "danger" : "warn"}>{t.result === "pass" ? "قبول" : t.result === "fail" ? "رد" : "در انتظار"}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {fb ? (
                  <div className="rounded-xl border border-line-soft p-3">
                    <p className="text-xs font-bold">بازخورد متقاضی</p>
                    <p className="mt-1 flex items-center gap-1 text-warn">{Array.from({ length: fb.score }).map((_, i) => <Icon key={i} name="star" size={13} />)}</p>
                    <p className="mt-1 text-xs leading-6 text-muted">{fb.comment}</p>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border border-line-soft p-3">
                <p className="mb-3 text-xs font-bold">آخرین رویدادها</p>
                <Timeline items={events.slice(0, 5)} compact />
                <button type="button" onClick={() => setTab("history")} className="mt-3 text-[0.7rem] font-bold text-warn">تاریخچه کامل</button>
              </div>
            </div>
          ) : null}

          {tab === "documents" ? (
            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted">برای هر مدرک، پیش‌نمایش، تأیید یا رد ثبت می‌شود. دلیل رد الزامی است.</p>
                {!readOnly ? <Button size="sm" variant="ghost" icon="upload">بارگذاری مدرک</Button> : null}
              </div>
              <div className="table-wrap rounded-xl border border-line-soft">
                <table className="data">
                  <thead>
                    <tr>
                      <th>نوع مدرک</th>
                      <th>بارگذار</th>
                      <th>تاریخ</th>
                      <th>وضعیت</th>
                      <th className="hidden md:table-cell">دلیل / توضیح</th>
                      <th aria-label="عملیات" />
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => (
                      <tr key={d.id}>
                        <td className="text-xs font-semibold">{DOC_TYPE_LABEL[d.type] ?? d.type}</td>
                        <td className="text-xs text-muted">{d.uploader}</td>
                        <td className="text-xs text-muted">{jalali(d.date)}</td>
                        <td>
                          <Badge tone={d.status === "approved" ? "success" : d.status === "rejected" ? "danger" : "warn"} dot>
                            {d.status === "approved" ? "تأیید شده" : d.status === "rejected" ? "رد شده" : "منتظر بررسی"}
                          </Badge>
                        </td>
                        <td className="hidden max-w-56 truncate text-xs text-muted md:table-cell">{d.rejectReason ?? "—"}</td>
                        <td>
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" icon="eye">پیش‌نمایش</Button>
                            {!readOnly && d.status === "pending" ? (
                              <>
                                <Button size="sm" variant="primary" icon="check" onClick={() => approve(d)}>تأیید</Button>
                                <Button size="sm" variant="danger" onClick={() => setRejectDoc(d)}>رد</Button>
                              </>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {tab === "equipment" ? (
            equipment.length === 0 ? (
              <EmptyState icon="grid" title="تجهیزاتی ثبت نشده" description="پس از شروع مرحله اجرا، فهرست تجهیزات و سریال‌ها در این بخش ثبت می‌شود." />
            ) : (
              <div className="table-wrap rounded-xl border border-line-soft">
                <table className="data">
                  <thead>
                    <tr>
                      <th>نوع تجهیز</th>
                      <th>برند</th>
                      <th>مدل</th>
                      <th>شماره سریال</th>
                      <th>تعداد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map((e) => (
                      <tr key={e.id}>
                        <td className="text-xs font-semibold">{e.type}</td>
                        <td className="text-xs">{e.brand}</td>
                        <td className="text-xs text-muted">{e.model}</td>
                        <td className="num text-[0.7rem] text-muted">{e.serial}</td>
                        <td className="num text-xs">{faNum(e.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}

          {tab === "progress" ? (
            reports.length === 0 ? (
              <EmptyState icon="chart" title="گزارش پیشرفتی ثبت نشده" description="گزارش‌ها همراه با درصد پیشرفت و تصاویر توسط نصاب ثبت می‌شوند." />
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div key={r.id} className="rounded-xl border border-line-soft p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge tone="info">{percent(r.percent)}</Badge>
                        <span className="text-xs font-bold">{r.author}</span>
                      </div>
                      <span className="text-[0.65rem] text-muted">{jalali(r.date)}</span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-muted">{r.text}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[0.65rem] text-muted">
                      <Icon name="file" size={12} /> {faNum(r.images)} تصویر پیوست
                    </div>
                  </div>
                ))}
                {!readOnly ? <Button variant="ghost" icon="plus">ثبت گزارش جدید</Button> : null}
              </div>
            )
          ) : null}

          {tab === "payments" ? (
            <div className="space-y-3">
              {contract ? (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line-soft bg-bg/40 p-3 text-xs">
                  <span className="flex items-center gap-1.5"><Icon name="file" size={14} className="text-muted" /> قرارداد {money(contract.amount)}</span>
                  <Badge tone={contract.status === "signed" ? "success" : "warn"} dot>{contract.status === "signed" ? `امضا شده — ${contract.signedAt ? jalali(contract.signedAt) : ""}` : "در انتظار امضا"}</Badge>
                </div>
              ) : null}
              <div className="table-wrap rounded-xl border border-line-soft">
                <table className="data">
                  <thead>
                    <tr>
                      <th>عنوان</th>
                      <th>مبلغ</th>
                      <th>سررسید</th>
                      <th>تاریخ پرداخت</th>
                      <th>وضعیت</th>
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {tab === "history" ? <Timeline items={events} /> : null}

          {tab === "tickets" ? (
            tickets.length === 0 ? (
              <EmptyState icon="message" title="تیکتی ثبت نشده" description="درخواست‌های پشتیبانی و شکایت‌ها در این بخش نمایش داده می‌شوند." />
            ) : (
              <div className="space-y-2">
                {tickets.map((t) => (
                  <div key={t.id} className="rounded-xl border border-line-soft p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold">{t.subject}</p>
                      <Badge tone={t.status === "open" ? "warn" : t.status === "answered" ? "info" : "success"}>{t.status === "open" ? "باز" : t.status === "answered" ? "پاسخ داده شده" : "بسته"}</Badge>
                    </div>
                    <p className="mt-1 text-[0.65rem] text-muted">{jalaliTime(t.createdAt)}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{t.messages[t.messages.length - 1]?.text}</p>
                  </div>
                ))}
              </div>
            )
          ) : null}
        </div>
      </Card>

      <Modal
        open={Boolean(rejectDoc)}
        onClose={() => setRejectDoc(null)}
        title="رد مدرک"
        description="دلیل رد برای بارگذار نمایش داده می‌شود و در تاریخچه ثبت می‌گردد."
        footer={
          <>
            <Button variant="danger" icon="xCircle" disabled={reason.trim().length < 5} onClick={reject}>ثبت رد</Button>
            <Button variant="ghost" onClick={() => setRejectDoc(null)}>انصراف</Button>
          </>
        }
      >
        <Field label="دلیل رد" required hint="حداقل ۵ نویسه">
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="مثلاً: تصویر قبض خوانا نیست." />
        </Field>
      </Modal>
    </div>
  );
}

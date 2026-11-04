import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, CardHeader, EmptyState, Field, Modal, PageHeader, Textarea, cn } from "../components/ui";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toast";
import { documentsOf, equipmentOf, projectById, reportsOf, testsOf } from "../lib/data";
import { faNum, jalali, num1 } from "../lib/format";
import { DOC_TYPE_LABEL, stageLabel } from "../lib/labels";

const CHECKLIST = [
  "تطابق ظرفیت نصب‌شده با مجوز",
  "ایمنی سازه و اتصال به بام",
  "ارت و اتصال به زمین",
  "کابل‌کشی و حفاظت مسیرها",
  "نصب برچسب‌های هشدار و نقشه تک‌خطی",
];

export default function InspectorReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const project = projectById(id);
  const [checked, setChecked] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [docStates, setDocStates] = useState<Record<string, "pending" | "approved" | "rejected">>({});

  const docs = useMemo(() => (project ? documentsOf(project.id) : []), [project]);
  const tests = useMemo(() => (project ? testsOf(project.id) : []), [project]);

  if (!project) {
    return <Card><EmptyState icon="alert" title="پروژه یافت نشد" action={<Link className="btn btn-primary" to="/inspector">بازگشت به صف</Link>} /></Card>;
  }

  const allChecked = CHECKLIST.every((_, i) => checked[i]);

  const decide = () => {
    if (decision === "reject" && reason.trim().length < 5) return;
    toast(decision === "approve" ? "پروژه تأیید و به مرحله بعد منتقل شد (دمو)." : "پروژه رد شد و دلیل ثبت گردید.", decision === "approve" ? "success" : "danger");
    setDecision(null);
    navigate("/inspector");
  };

  return (
    <div>
      <PageHeader
        title={`بررسی ${project.code}`}
        subtitle={`${project.applicantName} — ${stageLabel(project.stage)} — ${num1(project.capacityKw)} کیلووات`}
        back={<Link to="/inspector" className="mb-1 inline-flex items-center gap-1 text-xs text-muted"><Icon name="chevronRight" size={13} /> بازگشت به صف</Link>}
        actions={<Badge tone="warn" dot>منتظر تصمیم</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_19rem]">
        <div className="space-y-4">
          <Card>
            <CardHeader title="مدارک ارسالی" subtitle="پیش‌نمایش و تأیید/رد هر مدرک" icon="file" />
            <div className="divide-y divide-line-soft">
              {docs.map((d) => {
                const state = docStates[d.id] ?? d.status;
                return (
                  <div key={d.id} className="flex flex-wrap items-center gap-2 px-4 py-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-line-soft text-muted"><Icon name="file" size={16} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold">{DOC_TYPE_LABEL[d.type] ?? d.type}</p>
                      <p className="text-[0.65rem] text-muted">{d.uploader} — {jalali(d.date)}</p>
                    </div>
                    <Badge tone={state === "approved" ? "success" : state === "rejected" ? "danger" : "warn"}>{state === "approved" ? "تأییدشده" : state === "rejected" ? "ردشده" : "در بررسی"}</Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" icon="eye">پیش‌نمایش</Button>
                      <Button size="sm" variant="primary" icon="check" disabled={state === "approved"} onClick={() => setDocStates((s) => ({ ...s, [d.id]: "approved" }))}>تأیید</Button>
                      <Button size="sm" variant="danger" disabled={state === "rejected"} onClick={() => setDocStates((s) => ({ ...s, [d.id]: "rejected" }))}>رد</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="نتیجه آزمون‌ها" subtitle="آزمون عملکرد، ایمنی و عایقی" icon="shield" />
            <ul className="divide-y divide-line-soft">
              {tests.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 px-4 py-3 text-xs">
                  <span className="font-semibold">{t.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] text-muted">{jalali(t.date)}</span>
                    <Badge tone={t.result === "pass" ? "success" : t.result === "fail" ? "danger" : "warn"}>{t.result === "pass" ? "قبول" : t.result === "fail" ? "رد" : "در انتظار"}</Badge>
                  </div>
                </li>
              ))}
              {tests.length === 0 ? <li className="px-4 py-6 text-center text-xs text-muted">آزمونی ثبت نشده است.</li> : null}
            </ul>
          </Card>

          <Card>
            <CardHeader title="چک‌لیست بازدید فنی" subtitle="همه موارد باید تأیید شوند" icon="checkCircle" action={<Badge tone={allChecked ? "success" : "warn"}>{faNum(Object.values(checked).filter(Boolean).length)} از {faNum(CHECKLIST.length)}</Badge>} />
            <ul className="space-y-1 p-3">
              {CHECKLIST.map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                    className={cn("flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-right text-xs", checked[i] ? "border-success/40 bg-success-soft/50" : "border-line-soft")}
                    aria-pressed={Boolean(checked[i])}
                  >
                    <span className={cn("grid size-5 place-items-center rounded border", checked[i] ? "border-success bg-success text-white" : "border-line")}>
                      {checked[i] ? <Icon name="check" size={12} /> : null}
                    </span>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="space-y-3">
          <Card className="p-4">
            <p className="text-xs font-bold">جمع‌بندی پروژه</p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted">
              <li className="flex justify-between"><span>ظرفیت</span><span className="num font-bold text-ink">{num1(project.capacityKw)} کیلووات</span></li>
              <li className="flex justify-between"><span>تجهیزات</span><span className="num font-bold text-ink">{faNum(equipmentOf(project.id).length)} قلم</span></li>
              <li className="flex justify-between"><span>گزارش پیشرفت</span><span className="num font-bold text-ink">{faNum(reportsOf(project.id).length)}</span></li>
              <li className="flex justify-between"><span>مدارک</span><span className="num font-bold text-ink">{faNum(docs.length)}</span></li>
            </ul>
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="primary" icon="checkCircle" onClick={() => setDecision("approve")} disabled={!allChecked}>تأیید نهایی</Button>
              <Button variant="danger" icon="xCircle" onClick={() => setDecision("reject")}>رد با دلیل</Button>
            </div>
            {!allChecked ? <p className="mt-2 text-[0.65rem] text-warn">برای تأیید، ابتدا همه موارد چک‌لیست را علامت بزنید.</p> : null}
          </Card>

          <Card className="p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold"><Icon name="clock" size={14} /> راهنما</p>
            <p className="mt-1 text-[0.7rem] leading-6 text-muted">تصمیم شما همراه با دلیل در تاریخچه پروژه ثبت می‌شود و برای متقاضی و نصاب اعلان ارسال می‌گردد.</p>
          </Card>
        </aside>
      </div>

      <Modal
        open={Boolean(decision)}
        onClose={() => setDecision(null)}
        title={decision === "approve" ? "تأیید نهایی پروژه" : "رد پروژه"}
        description={decision === "approve" ? "پس از تأیید، پروژه به مرحله بعد منتقل می‌شود." : "دلیل رد برای متقاضی و نصاب ارسال می‌شود."}
        footer={
          <>
            <Button variant={decision === "approve" ? "primary" : "danger"} disabled={decision === "reject" && reason.trim().length < 5} onClick={decide}>
              {decision === "approve" ? "تأیید و ادامه" : "ثبت رد"}
            </Button>
            <Button variant="ghost" onClick={() => setDecision(null)}>انصراف</Button>
          </>
        }
      >
        {decision === "reject" ? (
          <Field label="دلیل رد" required hint="حداقل ۵ نویسه">
            <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="مثلاً: آزمون ارت مطابق استاندارد نیست." />
          </Field>
        ) : (
          <p className="text-xs leading-6 text-muted">همه مدارک و چک‌لیست بررسی شد. با تأیید، پرونده به مرحله بعد منتقل و به متقاضی اطلاع داده می‌شود.</p>
        )}
      </Modal>
    </div>
  );
}

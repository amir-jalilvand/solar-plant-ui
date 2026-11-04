import { useState } from "react";
import { Badge, Button, Card, CardHeader, EmptyState, ErrorState, Field, Input, Modal, PageHeader, Select, SkeletonCard, Textarea } from "../components/ui";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { useToast } from "../components/Toast";
import { applicantName, feedbackOf, projectsOfApplicant, tickets } from "../lib/data";
import { faNum, jalali } from "../lib/format";
import { TICKET_STATUS } from "../lib/labels";

export default function ApplicantSupport() {
  const { toast } = useToast();
  const q = useMockQuery(() => ({
    tickets: tickets.filter((t) => projectsOfApplicant(applicantName).some((p) => p.id === t.projectId)),
    feedback: projectsOfApplicant(applicantName).map((p) => ({ project: p, fb: feedbackOf(p.id) })),
  }), []);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("after_sales");
  const [score, setScore] = useState(4);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  if (q.status === "loading") return <div className="grid gap-3 md:grid-cols-2">{Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}</div>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const data = q.data!;
  const myProjects = projectsOfApplicant(applicantName);

  return (
    <div>
      <PageHeader
        title="خدمات پس از فروش و پشتیبانی"
        subtitle="ثبت درخواست، پیگیری تیکت و ثبت بازخورد کیفیت خدمات"
        actions={
          <Button variant="accent" icon="plus" onClick={() => setOpen(true)}>
            درخواست پشتیبانی
          </Button>
        }
      />

      {q.isEmpty || data.tickets.length === 0 ? (
        <Card className="mb-4">
          <EmptyState icon="message" title="تیکت بازی ندارید" description="در صورت بروز مشکل در نیروگاه، از دکمه «درخواست پشتیبانی» استفاده کنید." />
        </Card>
      ) : (
        <div className="mb-5 grid gap-3 lg:grid-cols-2">
          {data.tickets.map((ticket) => {
            const meta = TICKET_STATUS[ticket.status];
            return (
              <Card key={ticket.id}>
                <CardHeader
                  title={ticket.subject}
                  subtitle={`${ticket.type === "complaint" ? "شکایت" : "خدمات پس از فروش"} — ${jalali(ticket.createdAt)}`}
                  icon="message"
                  action={<Badge tone={meta.tone} dot>{meta.label}</Badge>}
                />
                <div className="space-y-2 p-4">
                  {ticket.messages.map((m, i) => (
                    <div key={i} className={`rounded-xl p-3 text-xs leading-6 ${i % 2 === 0 ? "bg-bg/70" : "bg-info-soft/50"}`}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-bold">{m.author}</span>
                        <span className="text-[0.6rem] text-muted">{jalali(m.at)}</span>
                      </div>
                      {m.text}
                    </div>
                  ))}
                  {ticket.status !== "closed" ? (
                    <div className="flex gap-2 pt-1">
                      <Input placeholder="پاسخ خود را بنویسید…" aria-label="پاسخ" />
                      <Button size="sm" onClick={() => toast("پاسخ شما ثبت شد (دمو).")}>ارسال</Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader title="ثبت بازخورد و امتیاز" subtitle="تجربه خود از خدمات نصاب و پلتفرم را ثبت کنید" icon="star" />
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <div>
            <Field label="پروژه">
              <Select defaultValue={myProjects[0]?.id} aria-label="پروژه">
                {myProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.code} — {p.city}</option>
                ))}
              </Select>
            </Field>
            <div className="mt-3">
              <Field label="امتیاز (۱ تا ۵)">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setScore(n)}
                      aria-label={`امتیاز ${faNum(n)}`}
                      aria-pressed={score === n}
                      className={`grid size-10 place-items-center rounded-xl border transition-colors ${n <= score ? "border-accent bg-accent-soft text-warn" : "border-line text-muted"}`}
                    >
                      <Icon name="star" size={18} />
                    </button>
                  ))}
                  <span className="num mr-2 text-sm font-bold">{faNum(score)} از ۵</span>
                </div>
              </Field>
            </div>
            <div className="mt-3">
              <Field label="نظر شما" hint="حداکثر ۳۰۰ نویسه">
                <Textarea rows={3} value={comment} maxLength={300} onChange={(e) => setComment(e.target.value)} placeholder="کیفیت نصب، رفتار تیم، زمان‌بندی…" />
              </Field>
            </div>
            <Button
              className="mt-3"
              variant="primary"
              onClick={() => {
                setSent(true);
                toast("بازخورد شما ثبت شد. سپاس از همراهی.");
              }}
            >
              ثبت بازخورد
            </Button>
            {sent ? <p className="mt-2 text-xs font-semibold text-success">بازخورد ثبت شد.</p> : null}
          </div>

          <div className="rounded-xl border border-line-soft bg-bg/50 p-4">
            <p className="mb-2 text-xs font-bold">بازخوردهای پیشین</p>
            <ul className="space-y-2 text-xs">
              {data.feedback.filter((f) => f.fb).map(({ project, fb }) => (
                <li key={project.id} className="rounded-lg border border-line-soft bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="num font-bold">{project.code}</span>
                    <span className="flex items-center gap-0.5 text-warn">
                      {Array.from({ length: fb!.score }).map((_, i) => <Icon key={i} name="star" size={12} />)}
                    </span>
                  </div>
                  <p className="mt-1 leading-6 text-muted">{fb!.comment}</p>
                  <p className="mt-1 text-[0.6rem] text-muted">{jalali(fb!.date)}</p>
                </li>
              ))}
              {data.feedback.every((f) => !f.fb) ? <li className="py-6 text-center text-muted">هنوز بازخوردی ثبت نشده است.</li> : null}
            </ul>
          </div>
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="درخواست پشتیبانی جدید"
        description="موضوع و توضیحات را وارد کنید؛ کارشناس پشتیبانی در اولین فرصت پاسخ می‌دهد."
        footer={
          <>
            <Button
              variant="accent"
              icon="check"
              disabled={subject.trim().length < 4}
              onClick={() => {
                setOpen(false);
                setSubject("");
                toast("تیکت شما با موفقیت ثبت شد (دمو).");
              }}
            >
              ثبت تیکت
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>انصراف</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="پروژه مرتبط" required>
            <Select aria-label="پروژه">
              {myProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.code} — {p.city}</option>
              ))}
            </Select>
          </Field>
          <Field label="نوع درخواست" required>
            <Select value={type} onChange={(e) => setType(e.target.value)} aria-label="نوع درخواست">
              <option value="after_sales">خدمات پس از فروش</option>
              <option value="complaint">شکایت</option>
            </Select>
          </Field>
          <Field label="موضوع" required hint="بین ۴ تا ۸۰ نویسه">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={80} placeholder="مثلاً قطع شدن اینورتر در ساعات اوج" />
          </Field>
          <Field label="توضیحات">
            <Textarea rows={4} placeholder="جزئیات مشکل، زمان بروز و اقدامات انجام‌شده…" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}

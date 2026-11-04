import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Field, Input, PageHeader, Select, Textarea, cn } from "../components/ui";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toast";
import { faNum, moneyShort } from "../lib/format";

interface FormState {
  name: string;
  type: "حقیقی" | "حقوقی";
  nationalId: string;
  mobile: string;
  province: string;
  city: string;
  address: string;
  roofType: "بام ساختمان" | "زمین" | "سایبان پارکینگ";
  capacity: string;
  connection: "تک‌فاز" | "سه‌فاز";
  files: Record<string, string>;
}

const STEPS = ["هویت متقاضی", "محل نصب", "مشخصات فنی", "مدارک و مرور"];
const REQUIRED_FILES = ["national_id", "bill", "map"];

const FILE_LABELS: Record<string, string> = {
  national_id: "کارت ملی / مدارک هویتی",
  bill: "قبض برق محل نصب",
  map: "نقشه یا تصویر محل نصب",
  deed: "سند مالکیت یا اجاره‌نامه",
};

function UploadBox({ label, value, onPick, required }: { label: string; value?: string; onPick: () => void; required?: boolean }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-dashed p-3 text-right transition-colors",
        value ? "border-success/50 bg-success-soft/40" : "border-line bg-bg/40 hover:border-accent",
      )}
    >
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", value ? "bg-success text-white" : "bg-line-soft text-muted")}>
        <Icon name={value ? "check" : "upload"} size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold">
          {label} {required ? <span className="text-danger">*</span> : null}
        </span>
        <span className="block truncate text-[0.65rem] text-muted">{value ?? "فایل PDF یا تصویر تا ۵ مگابایت"}</span>
      </span>
      <span className="text-[0.65rem] font-semibold text-warn">{value ? "تغییر" : "انتخاب فایل"}</span>
    </button>
  );
}

export default function NewRequestWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>({
    name: "",
    type: "حقیقی",
    nationalId: "",
    mobile: "",
    province: "تهران",
    city: "",
    address: "",
    roofType: "بام ساختمان",
    capacity: "5",
    connection: "تک‌فاز",
    files: {},
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const validate = (current: number): boolean => {
    const e: Record<string, string> = {};
    if (current === 0) {
      if (form.name.trim().length < 3) e.name = "نام و نام خانوادگی را کامل وارد کنید.";
      if (!/^\d{10}$/.test(form.nationalId.replace(/\D/g, ""))) e.nationalId = "کد ملی باید ۱۰ رقم باشد.";
      if (!/^09\d{9}$/.test(form.mobile.replace(/\D/g, ""))) e.mobile = "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
    }
    if (current === 1) {
      if (!form.city.trim()) e.city = "شهر را وارد کنید.";
      if (form.address.trim().length < 10) e.address = "نشانی کامل محل نصب را وارد کنید (حداقل ۱۰ نویسه).";
    }
    if (current === 2) {
      if (!form.capacity || Number(form.capacity) <= 0) e.capacity = "ظرفیت را انتخاب کنید.";
    }
    if (current === 3) {
      REQUIRED_FILES.forEach((f) => {
        if (!form.files[f]) e[f] = "بارگذاری این مدرک الزامی است.";
      });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const submit = () => {
    if (!validate(3)) return;
    toast("درخواست احداث ثبت شد و کد رهگیری صادر گردید (دمو).");
    navigate("/applicant/projects");
  };

  const estimate = useMemo(() => Number(form.capacity || 0) * 78_000_000, [form.capacity]);

  return (
    <div>
      <PageHeader title="ثبت درخواست احداث" subtitle="در چهار گام، اطلاعات نیروگاه خورشیدی خود را ثبت کنید." back={<span className="mb-2 inline-flex items-center gap-1 text-xs text-muted"><Icon name="chevronRight" size={13} /> بازگشت به داشبورد</span>} />

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Card className="p-4">
            <ol className="flex items-center gap-1" aria-label="گام‌های ثبت درخواست">
              {STEPS.map((label, i) => (
                <li key={label} className="flex flex-1 items-center gap-1">
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold", i < step ? "bg-success text-white" : i === step ? "bg-accent text-[#1a1205]" : "bg-line-soft text-muted")}>
                    {i < step ? <Icon name="check" size={13} /> : faNum(i + 1)}
                  </span>
                  <span className={cn("hidden text-[0.7rem] sm:block", i === step ? "font-bold" : "text-muted")}>{label}</span>
                  {i < STEPS.length - 1 ? <span className={cn("mx-1 h-px flex-1", i < step ? "bg-success/50" : "bg-line")} /> : null}
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-4 sm:p-5">
            {step === 0 ? (
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold">۱. هویت متقاضی</h2>
                <Field label="نام متقاضی" required error={errors.name} hint={form.type === "حقوقی" ? "نام شرکت یا شخص حقوقی" : "نام و نام خانوادگی"}>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="مثلاً مهدی رضایی" />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="نوع متقاضی" required>
                    <Select value={form.type} onChange={(e) => set("type", e.target.value as FormState["type"])}>
                      <option value="حقیقی">شخص حقیقی</option>
                      <option value="حقوقی">شخص حقوقی</option>
                    </Select>
                  </Field>
                  <Field label="کد ملی / شناسه ملی" required error={errors.nationalId}>
                    <Input value={form.nationalId} onChange={(e) => set("nationalId", e.target.value)} inputMode="numeric" placeholder="۱۰ رقم" />
                  </Field>
                </div>
                <Field label="شماره موبایل" required error={errors.mobile} hint="کد تأیید به این شماره ارسال می‌شود.">
                  <Input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} inputMode="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
                </Field>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold">۲. محل نصب</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="استان" required>
                    <Select value={form.province} onChange={(e) => set("province", e.target.value)}>
                      {["تهران", "البرز", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "گیلان", "مازندران", "یزد", "کرمان"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="شهر" required error={errors.city}>
                    <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="مثلاً تهران" />
                  </Field>
                </div>
                <Field label="نشانی کامل" required error={errors.address}>
                  <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} rows={2} placeholder="خیابان، کوچه، پلاک، واحد" />
                </Field>
                <Field label="نوع محل نصب" required>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(["بام ساختمان", "زمین", "سایبان پارکینگ"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set("roofType", t)}
                        className={cn("rounded-xl border px-3 py-2 text-xs font-semibold", form.roofType === t ? "border-accent bg-accent-soft text-warn" : "border-line text-muted hover:border-accent/50")}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>
                <UploadBox label={FILE_LABELS["map"]} value={form.files.map} onPick={() => set("files", { ...form.files, map: "map-site.pdf" })} />
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold">۳. مشخصات فنی</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="ظرفیت درخواستی (کیلووات)" required error={errors.capacity} hint="ظرفیت‌های رایج: ۵، ۱۰، ۲۰، ۵۰ و ۱۰۰">
                    <Select value={form.capacity} onChange={(e) => set("capacity", e.target.value)}>
                      {[3, 5, 10, 20, 30, 50, 100, 200].map((c) => (
                        <option key={c} value={String(c)}>{faNum(c)} کیلووات</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="نوع اتصال" required>
                    <Select value={form.connection} onChange={(e) => set("connection", e.target.value as FormState["connection"])}>
                      <option value="تک‌فاز">تک‌فاز</option>
                      <option value="سه‌فاز">سه‌فاز</option>
                    </Select>
                  </Field>
                </div>
                <Field label="توضیحات تکمیلی">
                  <Textarea rows={3} placeholder="هر نکته‌ای که در بررسی ظرفیت مؤثر است…" />
                </Field>
                <UploadBox label={FILE_LABELS.bill} value={form.files.bill} onPick={() => set("files", { ...form.files, bill: "electricity-bill.pdf" })} required />
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <h2 className="text-sm font-extrabold">۴. مدارک و مرور نهایی</h2>
                <div className="space-y-2">
                  {REQUIRED_FILES.map((f) => (
                    <div key={f}>
                      <UploadBox label={FILE_LABELS[f]} value={form.files[f]} onPick={() => set("files", { ...form.files, [f]: `${f}.pdf` })} required />
                      {errors[f] ? <p className="mt-1 text-[0.65rem] font-semibold text-danger">{errors[f]}</p> : null}
                    </div>
                  ))}
                  <UploadBox label={FILE_LABELS.deed} value={form.files.deed} onPick={() => set("files", { ...form.files, deed: "deed.pdf" })} />
                </div>

                <div className="rounded-xl border border-line-soft bg-bg/50 p-3">
                  <p className="mb-2 text-xs font-bold">مرور اطلاعات</p>
                  <dl className="grid gap-2 text-xs sm:grid-cols-2">
                    {[
                      ["متقاضی", form.name || "—"],
                      ["نوع", form.type],
                      ["کد ملی", form.nationalId || "—"],
                      ["موبایل", form.mobile || "—"],
                      ["استان / شهر", `${form.province} / ${form.city || "—"}`],
                      ["نشانی", form.address || "—"],
                      ["ظرفیت", `${faNum(Number(form.capacity || 0))} کیلووات`],
                      ["نوع اتصال", form.connection],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2 border-b border-dashed border-line-soft pb-1.5">
                        <dt className="text-muted">{k}</dt>
                        <dd className="truncate font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line-soft pt-4">
              <Button variant="ghost" icon="chevronRight" onClick={() => (step === 0 ? navigate("/applicant") : setStep((s) => s - 1))} disabled={step === 0}>
                {step === 0 ? "بازگشت" : "مرحله قبل"}
              </Button>
              {step < STEPS.length - 1 ? (
                <Button variant="primary" onClick={next}>
                  مرحله بعد <Icon name="chevronLeft" size={15} />
                </Button>
              ) : (
                <Button variant="accent" icon="check" onClick={submit}>ثبت نهایی درخواست</Button>
              )}
            </div>
          </Card>
        </div>

        <aside className="space-y-3">
          <Card className="p-4">
            <p className="text-xs font-bold">خلاصه درخواست</p>
            <ul className="mt-2 space-y-2 text-xs text-muted">
              <li className="flex items-center justify-between"><span>ظرفیت</span><span className="num font-bold text-ink">{faNum(Number(form.capacity || 0))} کیلووات</span></li>
              <li className="flex items-center justify-between"><span>برآورد هزینه</span><span className="num font-bold text-ink">{moneyShort(estimate)}</span></li>
              <li className="flex items-center justify-between"><span>نوع اتصال</span><span className="font-bold text-ink">{form.connection}</span></li>
              <li className="flex items-center justify-between"><span>محل نصب</span><span className="font-bold text-ink">{form.roofType}</span></li>
            </ul>
            <div className="mt-3 rounded-lg bg-accent-soft/70 p-2.5 text-[0.65rem] leading-5 text-warn">
              برآورد هزینه تقریبی است و پس از بازدید فنی و تأیید ظرفیت نهایی می‌شود. محاسبات فنی جزو این نسخه نیست.
            </div>
          </Card>
          <Card className="p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold"><Icon name="shield" size={14} /> چرا این اطلاعات؟</p>
            <p className="mt-1.5 text-[0.7rem] leading-6 text-muted">مدارک هویتی و قبض برق برای احراز مالکیت و استعلام ظرفیت انشعاب استفاده می‌شود. همه فایل‌ها در این نسخه نمایشی هستند.</p>
          </Card>
          <Badge tone="info" className="inline-flex">پیش‌نویس شما به‌صورت خودکار ذخیره می‌شود</Badge>
        </aside>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Field, Input, Select } from "../components/ui";
import { Icon } from "../components/Icon";
import { ROLES, ROLE_ORDER } from "../lib/labels";
import { useRole } from "../lib/role";
import { faNum } from "../lib/format";
import type { Role } from "../lib/types";

export default function Login() {
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const sendCode = () => {
    if (!/^09\d{9}$/.test(mobile.replace(/\D/g, ""))) {
      setError("شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.");
      return;
    }
    setError("");
    setStep("otp");
  };

  const login = () => {
    if (code.replace(/\D/g, "").length < 4) {
      setError("کد تأیید ۵ رقمی را وارد کنید (در دمو: ۱۲۳۴۵).");
      return;
    }
    navigate(ROLES[role].home);
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand p-10 text-brand-ink lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 right-0 size-96 rounded-full bg-info/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-accent text-[#1a1205]"><Icon name="sun" size={24} /></span>
          <div>
            <p className="text-base font-extrabold">سامانه خورشیدی انشعابی</p>
            <p className="text-[0.7rem] text-white/60">مدیریت و نظارت بر نیروگاه‌های خورشیدی</p>
          </div>
        </div>
        <div className="relative max-w-lg">
          <h1 className="text-2xl font-extrabold leading-[1.7] xl:text-3xl">از درخواست تا تحویل، همه‌چیز شفاف و قابل پیگیری.</h1>
          <p className="mt-3 text-sm leading-7 text-white/70">
            یک سکو برای متقاضیان، نصابان، کارشناسان فنی و ناظران ساتبا؛ با خط زمانی پروژه، مدارک و وضعیت مالی در یک نگاه.
          </p>
          <ul className="mt-6 space-y-2 text-xs text-white/80">
            {["هفت مرحله شفاف چرخه عمر پروژه", "پرونده دیجیتال مدارک و آزمون‌ها", "پنل نظارتی ساتبا"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Icon name="checkCircle" size={15} className="text-accent" /> {t}</li>
            ))}
          </ul>
        </div>
        <p className="relative text-[0.65rem] text-white/40">نسخه نمایشی — داده‌ها ساختگی هستند</p>
      </div>

      <div className="flex items-center justify-center bg-bg px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-brand text-brand-ink"><Icon name="sun" size={20} /></span>
            <p className="text-sm font-extrabold">سامانه خورشیدی انشعابی</p>
          </div>

          <h2 className="text-xl font-extrabold">ورود به سامانه</h2>
          <p className="mt-1 text-xs text-muted">با شماره موبایل خود وارد شوید. در نسخه دمو، کد تأیید ۱۲۳۴۵ است.</p>

          <div className="mt-5 space-y-3">
            {step === "mobile" ? (
              <>
                <Field label="شماره موبایل" required error={error}>
                  <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="۰۹۱۲۳۴۵۶۷۸۹" inputMode="tel" autoComplete="tel" />
                </Field>
                <Button className="w-full" onClick={sendCode} icon="arrowUp">دریافت کد تأیید</Button>
              </>
            ) : (
              <>
                <Field label="کد تأیید" required error={error} hint={`کد به شماره ${mobile} ارسال شد.`}>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="۱۲۳۴۵" inputMode="numeric" maxLength={5} autoFocus />
                </Field>
                <Button className="w-full" onClick={login} icon="lock">ورود</Button>
                <button type="button" className="w-full text-center text-[0.7rem] text-muted" onClick={() => { setStep("mobile"); setCode(""); }}>تغییر شماره موبایل</button>
              </>
            )}

            <div className="relative py-2 text-center">
              <span className="relative z-10 bg-bg px-2 text-[0.65rem] text-muted">ورود نمایشی با نقش</span>
              <span className="absolute inset-x-0 top-1/2 h-px bg-line" aria-hidden="true" />
            </div>

            <Field label="نقش برای ورود دمو">
              <Select value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label="نقش">
                {ROLE_ORDER.map((r) => <option key={r} value={r}>{ROLES[r].label}</option>)}
              </Select>
            </Field>
            <Button variant="ghost" className="w-full" icon="zap" onClick={() => navigate(ROLES[role].home)}>
              ورود سریع به پنل {ROLES[role].short}
            </Button>
          </div>

          <p className="mt-6 text-center text-[0.65rem] leading-6 text-muted">
            با ورود، «شرایط استفاده» و «سیاست محرمانگی» را می‌پذیرید. این نسخه فقط برای نمایش رابط کاربری است و احراز هویت واقعی ندارد.
          </p>
          <p className="mt-1 text-center text-[0.6rem] text-muted">پشتیبانی: {faNum(1546)}</p>
        </div>
      </div>
    </div>
  );
}

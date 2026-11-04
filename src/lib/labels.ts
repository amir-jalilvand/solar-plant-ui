import type { Role, Stage, SubStage } from "./types";

export const STAGES: { key: Stage; label: string; short: string }[] = [
  { key: "request", label: "ثبت درخواست", short: "درخواست" },
  { key: "financing", label: "تأمین مالی و قرارداد", short: "تأمین مالی" },
  { key: "installer_assignment", label: "تخصیص نصاب", short: "تخصیص نصاب" },
  { key: "execution", label: "اجرای پروژه", short: "اجرا" },
  { key: "testing", label: "آزمون و تأیید نهایی", short: "آزمون" },
  { key: "handover", label: "تحویل پروژه", short: "تحویل" },
  { key: "after_sales", label: "خدمات پس از فروش", short: "پس از فروش" },
];

export const stageIndex = (stage: Stage): number => STAGES.findIndex((s) => s.key === stage);

export const stageLabel = (stage: Stage): string => STAGES.find((s) => s.key === stage)?.label ?? stage;

export const SUBSTAGE: Record<SubStage, { label: string; tone: "neutral" | "success" | "warn" | "danger" | "info" }> = {
  not_started: { label: "شروع نشده", tone: "neutral" },
  in_progress: { label: "در حال انجام", tone: "info" },
  waiting_review: { label: "منتظر بررسی", tone: "warn" },
  approved: { label: "تأیید شده", tone: "success" },
  rejected: { label: "رد شده", tone: "danger" },
  blocked: { label: "متوقف", tone: "danger" },
};

export const ROLES: Record<Role, { label: string; short: string; user: string; home: string }> = {
  applicant: { label: "متقاضی", short: "متقاضی", user: "مهدی رضایی", home: "/applicant" },
  installer: { label: "نصاب / پیمانکار", short: "نصاب", user: "شرکت تابش مهر پارس", home: "/installer" },
  inspector: { label: "کارشناس فنی / ناظر", short: "کارشناس", user: "نیلوفر رستمی", home: "/inspector" },
  admin: { label: "مدیر سکو", short: "مدیر", user: "آرش بهرامی", home: "/admin" },
  satba: { label: "ناظر ساتبا", short: "ساتبا", user: "کارشناس ساتبا", home: "/satba" },
};

export const ROLE_ORDER: Role[] = ["applicant", "installer", "inspector", "admin", "satba"];

export const DOC_TYPE_LABEL: Record<string, string> = {
  national_id: "کارت ملی",
  deed: "سند مالکیت / اجاره‌نامه",
  bill: "قبض برق",
  map: "نقشه محل نصب",
  contract: "قرارداد",
  equipment: "مدارک تجهیزات",
  test: "نتیجه آزمون",
  handover: "صورت‌جلسه تحویل",
  guarantee: "تعهدنامه گارانتی",
};

export const PAYMENT_STATUS: Record<string, { label: string; tone: "success" | "warn" | "danger" | "neutral" | "info" }> = {
  paid: { label: "پرداخت شده", tone: "success" },
  due: { label: "سررسید شده", tone: "warn" },
  overdue: { label: "معوق", tone: "danger" },
  scheduled: { label: "زمان‌بندی شده", tone: "neutral" },
};

export const TICKET_STATUS: Record<string, { label: string; tone: "success" | "warn" | "danger" | "neutral" | "info" }> = {
  open: { label: "باز", tone: "warn" },
  answered: { label: "پاسخ داده شده", tone: "info" },
  closed: { label: "بسته", tone: "success" },
};

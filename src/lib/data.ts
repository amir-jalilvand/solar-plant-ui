import type {
  Applicant,
  Contract,
  DocFile,
  Equipment,
  Feedback,
  Installer,
  Notification,
  Payment,
  ProgressReport,
  Project,
  Stage,
  SubStage,
  TestResult,
  Ticket,
  TimelineEvent,
  User,
} from "./types";
import { STAGES } from "./labels";

const now = new Date();

function iso(daysAgo: number, hour = 10, minute = 0): string {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}



export const installers: Installer[] = [
  {
    id: "INS-1",
    name: "شرکت تابش مهر پارس",
    manager: "کامران فتحی",
    score: 4.6,
    capacityKw: 1200,
    regions: ["تهران", "البرز", "قم"],
    docsStatus: "complete",
    completedProjects: 64,
    activeProjects: 9,
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    rejectionRate: 6,
    avgHandoverDays: 41,
  },
  {
    id: "INS-2",
    name: "مهندسی خورشید آریا",
    manager: "سعید امینی",
    score: 4.2,
    capacityKw: 900,
    regions: ["اصفهان", "یزد", "خوزستان"],
    docsStatus: "complete",
    completedProjects: 48,
    activeProjects: 7,
    phone: "۰۹۱۳۲۲۳۳۴۴۵",
    rejectionRate: 11,
    avgHandoverDays: 52,
  },
  {
    id: "INS-3",
    name: "گروه فنی نورسان",
    manager: "بابک شهبازی",
    score: 3.8,
    capacityKw: 600,
    regions: ["فارس", "کرمان", "هرمزگان"],
    docsStatus: "pending",
    completedProjects: 29,
    activeProjects: 5,
    phone: "۰۹۱۷۴۴۵۵۶۶۷",
    rejectionRate: 18,
    avgHandoverDays: 63,
  },
  {
    id: "INS-4",
    name: "شرکت انرژی پاک کویر",
    manager: "مژگان دهقان",
    score: 4.9,
    capacityKw: 2400,
    regions: ["یزد", "کرمان", "اصفهان"],
    docsStatus: "complete",
    completedProjects: 112,
    activeProjects: 12,
    phone: "۰۹۱۳۶۶۷۷۸۸۹",
    rejectionRate: 3,
    avgHandoverDays: 35,
  },
  {
    id: "INS-5",
    name: "تأسیسات سبز خزر",
    manager: "علی‌اکبر نعمتی",
    score: 3.1,
    capacityKw: 350,
    regions: ["گیلان", "مازندران"],
    docsStatus: "expired",
    completedProjects: 17,
    activeProjects: 3,
    phone: "۰۹۱۱۱۲۳۴۵۶۷",
    rejectionRate: 27,
    avgHandoverDays: 78,
  },
];

const seedRows: Array<{
  code: string;
  applicant: string;
  type: "حقیقی" | "حقوقی";
  city: string;
  address: string;
  kw: number;
  stage: Stage;
  sub: SubStage;
  installer: string;
  progress: number;
  nextAction: string;
  owner: string;
  created: number;
  flags?: string[];
}> = [
  {
    code: "P-1403-001",
    applicant: "مهدی رضایی",
    type: "حقیقی",
    city: "تهران",
    address: "سعادت‌آباد، بلوار دریا، کوچه صراف",
    kw: 5,
    stage: "execution",
    sub: "in_progress",
    installer: "INS-1",
    progress: 62,
    nextAction: "ثبت گزارش پیشرفت مرحله نصب پنل‌ها",
    owner: "نصاب",
    created: 34,
  },
  {
    code: "P-1403-002",
    applicant: "زهرا موسوی",
    type: "حقیقی",
    city: "اصفهان",
    address: "خیابان توحید، کوچه ۱۴، پلاک ۸",
    kw: 10,
    stage: "financing",
    sub: "waiting_review",
    installer: "INS-2",
    progress: 18,
    nextAction: "بررسی نهایی قرارداد و برنامه اقساط",
    owner: "کارشناس فنی",
    created: 21,
  },
  {
    code: "P-1403-003",
    applicant: "شرکت صنایع غذایی گلبهار",
    type: "حقوقی",
    city: "کرج",
    address: "شهرک صنعتی بهارستان، فاز ۲، قطعه ۱۹",
    kw: 100,
    stage: "installer_assignment",
    sub: "in_progress",
    installer: "INS-1",
    progress: 30,
    nextAction: "تأیید صلاحیت نصاب پیشنهادی",
    owner: "مدیر سکو",
    created: 18,
  },
  {
    code: "P-1403-004",
    applicant: "علی کریمی",
    type: "حقیقی",
    city: "شیراز",
    address: "بلوار زند، نبش کوچه ۲۳",
    kw: 5,
    stage: "testing",
    sub: "waiting_review",
    installer: "INS-1",
    progress: 88,
    nextAction: "بازبینی نتیجه آزمون عایقی",
    owner: "کارشناس فنی",
    created: 46,
  },
  {
    code: "P-1403-005",
    applicant: "فاطمه احمدی",
    type: "حقیقی",
    city: "مشهد",
    address: "احمدآباد، خیابان پاستور، پلاک ۴۱",
    kw: 20,
    stage: "handover",
    sub: "approved",
    installer: "INS-2",
    progress: 97,
    nextAction: "تأیید صورت‌جلسه تحویل توسط متقاضی",
    owner: "متقاضی",
    created: 58,
  },
  {
    code: "P-1403-006",
    applicant: "حسن نوری",
    type: "حقیقی",
    city: "تبریز",
    address: "ولیعصر، فلکه دانشگاه، کوچه ۹",
    kw: 15,
    stage: "after_sales",
    sub: "in_progress",
    installer: "INS-1",
    progress: 100,
    nextAction: "پیگیری درخواست گارانتی اینورتر",
    owner: "نصاب",
    created: 210,
  },
  {
    code: "P-1403-007",
    applicant: "شرکت پوشاک آرمان",
    type: "حقوقی",
    city: "تهران",
    address: "جاده مخصوص، خیابان گلستان، پلاک ۷",
    kw: 50,
    stage: "execution",
    sub: "blocked",
    installer: "INS-3",
    progress: 44,
    nextAction: "رفع توقف: مجوز پلیس راهور برای حمل سازه",
    owner: "نصاب",
    created: 63,
    flags: ["توقف اجرا"],
  },
  {
    code: "P-1403-008",
    applicant: "سارا حسینی",
    type: "حقیقی",
    city: "رشت",
    address: "گلسار، خیابان ۸۰، ساختمان یاس",
    kw: 5,
    stage: "request",
    sub: "not_started",
    installer: "INS-0",
    progress: 8,
    nextAction: "تکمیل مدارک هویتی و بارگذاری قبض برق",
    owner: "متقاضی",
    created: 3,
  },
  {
    code: "P-1403-009",
    applicant: "محمد صادقی",
    type: "حقیقی",
    city: "یزد",
    address: "صفائیه، بلوار جمهوری، کوچه ۱۲",
    kw: 30,
    stage: "execution",
    sub: "in_progress",
    installer: "INS-4",
    progress: 71,
    nextAction: "تحویل تجهیزات و ثبت سریال اینورتر",
    owner: "نصاب",
    created: 39,
  },
  {
    code: "P-1403-010",
    applicant: "شرکت کشاورزی دشت سبز",
    type: "حقوقی",
    city: "همدان",
    address: "جاده ملایر، شهرک صنعتی، فاز ۱",
    kw: 200,
    stage: "financing",
    sub: "rejected",
    installer: "INS-2",
    progress: 22,
    nextAction: "اصلاح ضمانت‌نامه بانکی و ارسال مجدد",
    owner: "متقاضی",
    created: 27,
    flags: ["رد تأمین مالی"],
  },
  {
    code: "P-1403-011",
    applicant: "رضا شریفی",
    type: "حقیقی",
    city: "قم",
    address: "پردیسان، بلوار امین، کوچه ۵",
    kw: 10,
    stage: "testing",
    sub: "waiting_review",
    installer: "INS-1",
    progress: 90,
    nextAction: "تأیید نهایی آزمون و صدور تأییدیه",
    owner: "کارشناس فنی",
    created: 51,
  },
  {
    code: "P-1403-012",
    applicant: "مریم کاظمی",
    type: "حقیقی",
    city: "اهواز",
    address: "کیانپارس، خیابان ۱۰ شرقی، پلاک ۳",
    kw: 5,
    stage: "handover",
    sub: "in_progress",
    installer: "INS-1",
    progress: 94,
    nextAction: "بارگذاری صورت‌جلسه تحویل و آموزش بهره‌بردار",
    owner: "نصاب",
    created: 66,
  },
  {
    code: "P-1403-013",
    applicant: "شرکت فولاد آریا",
    type: "حقوقی",
    city: "اصفهان",
    address: "شهرک صنعتی مورچه‌خورت، خیابان ۴",
    kw: 500,
    stage: "execution",
    sub: "in_progress",
    installer: "INS-4",
    progress: 55,
    nextAction: "نصب استراکچر و کابل‌کشی DC",
    owner: "نصاب",
    created: 72,
  },
  {
    code: "P-1403-014",
    applicant: "مهدی رضایی",
    type: "حقیقی",
    city: "تهران",
    address: "سعادت‌آباد، میدان کاج، کوچه بهار",
    kw: 10,
    stage: "request",
    sub: "in_progress",
    installer: "INS-0",
    progress: 12,
    nextAction: "نهایی‌سازی ظرفیت پیشنهادی و ارسال درخواست",
    owner: "متقاضی",
    created: 2,
  },
  {
    code: "P-1403-015",
    applicant: "هتل کاسپین",
    type: "حقوقی",
    city: "بابلسر",
    address: "بلوار ساحلی، نبش خیابان ۱۲",
    kw: 80,
    stage: "after_sales",
    sub: "approved",
    installer: "INS-5",
    progress: 100,
    nextAction: "بازدید دوره‌ای شش‌ماهه",
    owner: "نصاب",
    created: 320,
  },
  {
    code: "P-1403-016",
    applicant: "نگار سلطانی",
    type: "حقیقی",
    city: "اراک",
    address: "خیابان شهید بهشتی، کوچه ۱۷",
    kw: 5,
    stage: "request",
    sub: "waiting_review",
    installer: "INS-0",
    progress: 15,
    nextAction: "بازبینی مدارک بارگذاری‌شده",
    owner: "کارشناس فنی",
    created: 6,
  },
  {
    code: "P-1403-017",
    applicant: "مهدی رضایی",
    type: "حقیقی",
    city: "تهران",
    address: "سعادت‌آباد، بلوار دریا، کوچه صراف",
    kw: 5,
    stage: "after_sales",
    sub: "approved",
    installer: "INS-1",
    progress: 100,
    nextAction: "ثبت بازخورد و امتیاز خدمات",
    owner: "متقاضی",
    created: 240,
  },
];

const pricePerKw = 78_000_000;

export const applicants: Applicant[] = seedRows.map((row, i) => ({
  id: `APP-${String(i + 1).padStart(2, "0")}`,
  userId: `USR-${String(i + 1).padStart(2, "0")}`,
  name: row.applicant,
  type: row.type,
  nationalId: row.type === "حقوقی" ? `۱۰۳۲۰${String(40000 + i * 137)}` : `۰۰${String(12345670 + i * 91)}`,
  mobile: `۰۹۱۲${String(3000000 + i * 12345)}`,
  city: row.city,
  address: row.address,
}));

export const projects: Project[] = seedRows.map((row, i) => {
  const amount = row.kw * pricePerKw;
  const installer = installers.find((x) => x.id === row.installer);
  const paidRatio = row.stage === "request" ? 0 : row.stage === "financing" ? 0.2 : row.stage === "installer_assignment" ? 0.3 : 0.7;
  return {
    id: `PRJ-${String(i + 1).padStart(2, "0")}`,
    code: row.code,
    applicantId: `APP-${String(i + 1).padStart(2, "0")}`,
    applicantName: row.applicant,
    applicantType: row.type,
    installerId: row.installer === "INS-0" ? "" : row.installer,
    installerName: installer?.name ?? "—",
    stage: row.stage,
    subStage: row.sub,
    capacityKw: row.kw,
    city: row.city,
    address: row.address,
    createdAt: iso(row.created),
    updatedAt: iso(Math.max(0, Math.round(row.created / 6))),
    progress: row.progress,
    nextAction: row.nextAction,
    nextActionOwner: row.owner,
    amount,
    paid: Math.round(amount * paidRatio),
    flags: row.flags ?? [],
  };
});

export const contracts: Contract[] = projects
  .filter((p) => p.stage !== "request")
  .map((p, i) => ({
    id: `CTR-${String(i + 1).padStart(2, "0")}`,
    projectId: p.id,
    amount: p.amount,
    status: p.stage === "financing" ? "pending_signature" : p.subStage === "rejected" ? "draft" : "signed",
    file: `contract-${p.code}.pdf`,
    signedAt: p.stage === "financing" ? undefined : iso(Math.max(0, Math.round(hash(p.code) % 40)) + 5),
  }));

const paymentTitles = ["پیش‌پرداخت (۴۰٪)", "پرداخت مرحله اجرا (۴۰٪)", "تسویه پس از تحویل (۲۰٪)"];

export const payments: Payment[] = [];
projects.forEach((p) => {
  if (p.stage === "request") return;
  const parts = [0.4, 0.4, 0.2];
  const stageOrder = STAGES.findIndex((s) => s.key === p.stage);
  parts.forEach((share, idx) => {
    const amount = Math.round(p.amount * share);
    let status: Payment["status"] = "scheduled";
    if (idx === 0) status = stageOrder >= 2 ? "paid" : "due";
    if (idx === 1) status = stageOrder >= 4 ? "paid" : stageOrder >= 3 ? "due" : "scheduled";
    if (idx === 2) status = stageOrder >= 6 ? "paid" : stageOrder >= 5 ? "due" : "scheduled";
    if (p.subStage === "blocked" && idx === 1) status = "overdue";
    if (p.subStage === "rejected" && idx === 0) status = "due";
    payments.push({
      id: `PAY-${p.id}-${idx + 1}`,
      projectId: p.id,
      title: paymentTitles[idx],
      amount,
      dueDate: iso(Math.max(0, 20 - idx * 12 - stageOrder * 2)),
      paidAt: status === "paid" ? iso(Math.max(0, 30 - idx * 9)) : undefined,
      status,
      stage: STAGES[Math.min(stageOrder, STAGES.length - 1)].key,
    });
  });
});

const docTypes: { type: string; from: number; status?: DocFile["status"] }[] = [
  { type: "national_id", from: 0, status: "approved" },
  { type: "bill", from: 0, status: "approved" },
  { type: "map", from: 0, status: "approved" },
  { type: "deed", from: 0, status: "pending" },
  { type: "contract", from: 1, status: "approved" },
  { type: "equipment", from: 3, status: "approved" },
  { type: "test", from: 4, status: "pending" },
  { type: "handover", from: 5, status: "approved" },
];

export const documents: DocFile[] = [];
projects.forEach((p) => {
  const order = STAGES.findIndex((s) => s.key === p.stage);
  docTypes
    .filter((d) => order >= d.from)
    .forEach((d, idx) => {
      let status = d.status ?? "pending";
      if (p.id === "PRJ-07" && d.type === "equipment") status = "rejected";
      if (p.subStage === "waiting_review" && d.type === "test") status = "pending";
      if (order > d.from + 1) status = "approved";
      documents.push({
        id: `DOC-${p.id}-${idx + 1}`,
        projectId: p.id,
        type: d.type,
        uploader: d.type === "national_id" || d.type === "bill" || d.type === "deed" ? "متقاضی" : "نصاب",
        status,
        date: iso(Math.max(1, 30 - idx * 3 - order)),
        rejectReason: status === "rejected" ? "سریال اینورتر با مدل اعلامی مطابقت ندارد." : undefined,
      });
    });
});

const equipmentCatalog = [
  { type: "پنل فتوولتائیک", brand: "Longi", model: "Hi-MO 6 / 580W" },
  { type: "اینورتر", brand: "Huawei", model: "SUN2000-5KTL-L1" },
  { type: "استراکچر", brand: "تابش‌سازه", model: "Galvanized 2×10" },
  { type: "کابل DC", brand: "Nexans", model: "PV1-F 6mm²" },
];

export const equipment: Equipment[] = [];
projects.forEach((p) => {
  const order = STAGES.findIndex((s) => s.key === p.stage);
  if (order < 3) return;
  const count = Math.max(2, Math.min(4, Math.round(p.capacityKw / 20) + 2));
  equipmentCatalog.slice(0, count).forEach((item, idx) => {
    equipment.push({
      id: `EQP-${p.id}-${idx}`,
      projectId: p.id,
      type: item.type,
      brand: item.brand,
      model: item.model,
      serial: `SN-${hash(p.code + idx).toString().slice(0, 7)}`,
      qty: item.type === "پنل فتوولتائیک" ? Math.max(8, Math.round(p.capacityKw / 0.58)) : 1,
    });
  });
});

export const progressReports: ProgressReport[] = [];
projects.forEach((p) => {
  const order = STAGES.findIndex((s) => s.key === p.stage);
  if (order < 3) return;
  const steps = [25, 55, 80, 95];
  const count = order === 3 ? 2 : 3;
  for (let i = 0; i < count; i += 1) {
    progressReports.push({
      id: `RPT-${p.id}-${i}`,
      projectId: p.id,
      date: iso(Math.max(1, 18 - i * 6)),
      percent: Math.min(99, steps[i]),
      text:
        i === 0
          ? "تخلیه تجهیزات و جانمایی اولیه انجام شد. سازه‌ها روی بام تثبیت شدند."
          : i === 1
            ? "نصب پنل‌ها و کابل‌کشی DC تکمیل شد؛ اینورتر نصب و راه‌اندازی اولیه انجام شد."
            : "آزمون عملکرد اولیه انجام شد و آموزش بهره‌بردار در محل ارائه گردید.",
      images: 2 + (i % 3),
      author: p.installerName,
    });
  }
});

export const tests: TestResult[] = projects
  .filter((p) => ["testing", "handover", "after_sales"].includes(p.stage))
  .map((p, i) => ({
    id: `TST-${i + 1}`,
    projectId: p.id,
    type: i % 2 === 0 ? "آزمون عملکرد و ایمنی" : "آزمون عایقی و ارت",
    result: p.subStage === "waiting_review" ? "pending" : i === 3 ? "fail" : "pass",
    date: iso(Math.max(1, 9 + i)),
  }));

export const tickets: Ticket[] = [
  {
    id: "TCK-1",
    projectId: "PRJ-06",
    type: "after_sales",
    status: "answered",
    subject: "قطع شدن اینورتر در ساعات اوج تابش",
    createdAt: iso(12),
    messages: [
      { author: "حسن نوری", at: iso(12), text: "اینورتر از دیروز ساعت ۱۳ قطع می‌شود و چراغ قرمز چشمک می‌زند." },
      { author: "پشتیبانی تابش مهر پارس", at: iso(11), text: "خطای ولتاژ شبکه است؛ بازدید فنی برای فردا هماهنگ شد." },
      { author: "حسن نوری", at: iso(10), text: "تیم فنی آمد و مشکل برطرف شد. ممنون." },
    ],
  },
  {
    id: "TCK-2",
    projectId: "PRJ-17",
    type: "complaint",
    status: "open",
    subject: "تأخیر در تحویل مدارک گارانتی",
    createdAt: iso(4),
    messages: [{ author: "مهدی رضایی", at: iso(4), text: "کارت گارانتی پنل‌ها هنوز تحویل نشده است." }],
  },
  {
    id: "TCK-3",
    projectId: "PRJ-15",
    type: "after_sales",
    status: "closed",
    subject: "درخواست سرویس دوره‌ای شش‌ماهه",
    createdAt: iso(40),
    messages: [
      { author: "هتل کاسپین", at: iso(40), text: "برای سرویس دوره‌ای شش‌ماهه درخواست بازدید داریم." },
      { author: "پشتیبانی سبز خزر", at: iso(38), text: "بازدید انجام شد و گزارش در پنل ثبت گردید." },
    ],
  },
];

export const feedback: Feedback[] = [
  { projectId: "PRJ-17", score: 5, comment: "نصب سریع و تمیز بود؛ توضیحات بهره‌برداری کامل بود.", date: iso(200) },
  { projectId: "PRJ-15", score: 4, comment: "کیفیت کار خوب بود، اما هماهنگی زمان‌بندی می‌توانست بهتر باشد.", date: iso(300) },
];

export const notifications: Notification[] = [
  { id: "NTF-1", userId: "applicant", text: "گزارش پیشرفت ۶۲٪ پروژه P-1403-001 ثبت شد.", read: false, date: iso(1, 9), tone: "info" },
  { id: "NTF-2", userId: "applicant", text: "درخواست شما برای P-1403-014 در حال بررسی است.", read: false, date: iso(1, 14), tone: "warn" },
  { id: "NTF-3", userId: "applicant", text: "صورت‌جلسه تحویل P-1403-017 تأیید شد.", read: true, date: iso(5), tone: "success" },
  { id: "NTF-4", userId: "applicant", text: "قسط دوم پروژه P-1403-001 سررسید شد.", read: false, date: iso(2), tone: "danger" },
  { id: "NTF-5", userId: "admin", text: "۳ پروژه در مرحله آزمون منتظر بررسی هستند.", read: false, date: iso(0, 8), tone: "warn" },
  { id: "NTF-6", userId: "admin", text: "پروژه P-1403-007 به دلیل مجوز حمل متوقف شد.", read: false, date: iso(2), tone: "danger" },
];

export const events: TimelineEvent[] = [];
let eventCounter = 0;
projects.forEach((p) => {
  const order = STAGES.findIndex((s) => s.key === p.stage);
  for (let i = 0; i <= order; i += 1) {
    const stage = STAGES[i];
    eventCounter += 1;
    events.push({
      id: `EVT-${eventCounter}`,
      projectId: p.id,
      at: iso(Math.max(0, (order - i) * 6 + 1), 9 + (i % 8)),
      actor: i === 0 ? "متقاضی" : i === 1 ? "کارشناس مالی" : i === 3 ? p.installerName : "کارشناس فنی",
      action: `انتقال به مرحله «${stage.label}»`,
      detail:
        i === 0
          ? "درخواست احداث با ظرفیت اعلامی ثبت و کد رهگیری صادر شد."
          : i === 1
            ? "قرارداد و برنامه اقساط بررسی و تأیید شد."
            : i === 2
              ? `نصاب «${p.installerName}» برای اجرا تخصیص یافت.`
              : i === 3
                ? "گزارش پیشرفت و مدارک تجهیزات بارگذاری شد."
                : i === 4
                  ? "نتیجه آزمون‌های فنی ثبت و به صف بررسی ارسال شد."
                  : "صورت‌جلسه تحویل تکمیل و پرونده بسته شد.",
      tone: p.subStage === "blocked" && i === order ? "danger" : p.subStage === "waiting_review" && i === order ? "warn" : "default",
    });
  }
});

export const users: User[] = [
  { id: "USR-01", name: "مهدی رضایی", role: "applicant", mobile: "۰۹۱۲۳۰۰۰۰۱", status: "active", lastSeen: iso(0, 11) },
  { id: "USR-02", name: "زهرا موسوی", role: "applicant", mobile: "۰۹۱۲۳۰۰۰۰۲", status: "active", lastSeen: iso(1) },
  { id: "USR-03", name: "شرکت تابش مهر پارس", role: "installer", mobile: "۰۹۱۲۱۲۳۴۵۶۷", status: "active", lastSeen: iso(0, 9) },
  { id: "USR-04", name: "مهندسی خورشید آریا", role: "installer", mobile: "۰۹۱۳۲۲۳۳۴۴۵", status: "active", lastSeen: iso(2) },
  { id: "USR-05", name: "نیلوفر رستمی", role: "inspector", mobile: "۰۹۱۲۰۰۰۰۰۵", status: "active", lastSeen: iso(0, 10) },
  { id: "USR-06", name: "آرش بهرامی", role: "admin", mobile: "۰۹۱۲۰۰۰۰۰۶", status: "active", lastSeen: iso(0, 8) },
  { id: "USR-07", name: "کارشناس ساتبا", role: "satba", mobile: "۰۹۱۲۰۰۰۰۰۷", status: "active", lastSeen: iso(3) },
  { id: "USR-08", name: "گروه فنی نورسان", role: "installer", mobile: "۰۹۱۷۴۴۵۵۶۶۷", status: "pending", lastSeen: iso(9) },
];

export const projectById = (id?: string): Project | undefined => projects.find((p) => p.id === id || p.code === id);

export const paymentsOf = (projectId: string): Payment[] => payments.filter((p) => p.projectId === projectId);
export const documentsOf = (projectId: string): DocFile[] => documents.filter((d) => d.projectId === projectId);
export const equipmentOf = (projectId: string): Equipment[] => equipment.filter((e) => e.projectId === projectId);
export const reportsOf = (projectId: string): ProgressReport[] => progressReports.filter((r) => r.projectId === projectId);
export const eventsOf = (projectId: string): TimelineEvent[] => events.filter((e) => e.projectId === projectId).sort((a, b) => (a.at < b.at ? 1 : -1));
export const ticketsOf = (projectId: string): Ticket[] => tickets.filter((t) => t.projectId === projectId);
export const contractOf = (projectId: string): Contract | undefined => contracts.find((c) => c.projectId === projectId);
export const testsOf = (projectId: string): TestResult[] => tests.filter((t) => t.projectId === projectId);
export const feedbackOf = (projectId: string): Feedback | undefined => feedback.find((f) => f.projectId === projectId);

export const projectsOfApplicant = (name: string): Project[] =>
  projects.filter((p) => p.applicantName === name).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

export const projectsOfInstaller = (name: string): Project[] =>
  projects.filter((p) => p.installerName === name).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

export const waitingReviewProjects = (): Project[] => projects.filter((p) => p.subStage === "waiting_review");

export const stats = {
  totalProjects: projects.length,
  totalCapacityKw: projects.reduce((s, p) => s + p.capacityKw, 0),
  activeProjects: projects.filter((p) => ["execution", "testing", "installer_assignment"].includes(p.stage)).length,
  blocked: projects.filter((p) => p.subStage === "blocked" || p.subStage === "rejected").length,
  revenue: projects.reduce((s, p) => s + p.paid, 0),
  contractValue: projects.reduce((s, p) => s + p.amount, 0),
  avgSatisfaction: 4.3,
  waitingReview: waitingReviewProjects().length,
  overduePayments: payments.filter((p) => p.status === "overdue").length,
  byStage: STAGES.map((s) => ({ label: s.short, value: projects.filter((p) => p.stage === s.key).length })),
};

export const applicantName = "مهدی رضایی";

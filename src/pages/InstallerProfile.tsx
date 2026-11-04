import { Badge, Button, Card, CardHeader, ErrorState, Field, Input, PageHeader, ProgressBar, SkeletonCard } from "../components/ui";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { useRole } from "../lib/role";
import { useToast } from "../components/Toast";
import { installers, projectsOfInstaller } from "../lib/data";
import { faNum, num1 } from "../lib/format";

export default function InstallerProfile() {
  const { user } = useRole();
  const { toast } = useToast();
  const q = useMockQuery(() => ({
    profile: installers.find((i) => i.name === user) ?? installers[0],
    projects: projectsOfInstaller(user),
  }), [user]);

  if (q.status === "loading") return <div className="grid gap-3 md:grid-cols-2"><SkeletonCard /><SkeletonCard /></div>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const { profile, projects } = q.data!;
  const utilization = Math.round((profile.activeProjects * 25 + 120) / profile.capacityKw * 100);

  return (
    <div>
      <PageHeader title="پروفایل فنی نصاب" subtitle="مدارک صلاحیت، مناطق فعالیت و ظرفیت اجرا" actions={<Button variant="ghost" icon="edit">ویرایش پروفایل</Button>} />

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Card>
            <CardHeader title={profile.name} subtitle={`مدیرعامل: ${profile.manager}`} icon="building" action={<Badge tone={profile.docsStatus === "complete" ? "success" : profile.docsStatus === "expired" ? "danger" : "warn"} dot>{profile.docsStatus === "complete" ? "مدارک کامل" : profile.docsStatus === "expired" ? "مدارک منقضی" : "مدارک ناقص"}</Badge>} />
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              <Field label="نام شرکت"><Input defaultValue={profile.name} readOnly /></Field>
              <Field label="مدیرعامل"><Input defaultValue={profile.manager} readOnly /></Field>
              <Field label="تلفن تماس"><Input defaultValue={profile.phone} readOnly /></Field>
              <Field label="ظرفیت اجرای سالانه (کیلووات)"><Input defaultValue={num1(profile.capacityKw)} readOnly /></Field>
              <div className="sm:col-span-2">
                <Field label="مناطق فعالیت">
                  <div className="flex flex-wrap gap-1.5">
                    {profile.regions.map((r) => <Badge key={r} tone="info">{r}</Badge>)}
                  </div>
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="مدارک صلاحیت" subtitle="پروانه کسب، گواهی دوره نصب، بیمه مسئولیت" icon="shield" action={<Button size="sm" variant="ghost" icon="upload">بارگذاری</Button>} />
            <ul className="divide-y divide-line-soft text-xs">
              {["پروانه کسب معتبر", "گواهی دوره نصب فتوولتائیک", "بیمه مسئولیت حرفه‌ای", "گواهی ایمنی کار در ارتفاع"].map((d, i) => (
                <li key={d} className="flex items-center justify-between gap-2 px-4 py-2.5">
                  <span className="flex items-center gap-2"><Icon name="file" size={14} className="text-muted" /> {d}</span>
                  <Badge tone={i === 3 && profile.docsStatus !== "complete" ? "warn" : "success"}>{i === 3 && profile.docsStatus !== "complete" ? "در انتظار تمدید" : "معتبر"}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="space-y-3">
          <Card className="p-4">
            <p className="text-xs font-bold">شاخص‌های عملکرد</p>
            <ul className="mt-3 space-y-3 text-xs">
              <li>
                <div className="flex justify-between"><span className="text-muted">امتیاز کیفیت</span><span className="num font-bold">{num1(profile.score)} از ۵</span></div>
                <ProgressBar value={profile.score * 20} className="mt-1" />
              </li>
              <li>
                <div className="flex justify-between"><span className="text-muted">میزان استفاده از ظرفیت</span><span className="num font-bold">{faNum(utilization)}٪</span></div>
                <ProgressBar value={utilization} className="mt-1" tone="info" />
              </li>
              <li>
                <div className="flex justify-between"><span className="text-muted">نرخ رد مدارک</span><span className="num font-bold text-danger">{faNum(profile.rejectionRate)}٪</span></div>
                <ProgressBar value={profile.rejectionRate} className="mt-1" tone="danger" />
              </li>
              <li className="flex justify-between"><span className="text-muted">میانگین زمان تحویل</span><span className="num font-bold">{faNum(profile.avgHandoverDays)} روز</span></li>
              <li className="flex justify-between"><span className="text-muted">پروژه‌های تکمیل‌شده</span><span className="num font-bold">{faNum(profile.completedProjects)}</span></li>
              <li className="flex justify-between"><span className="text-muted">پروژه‌های فعال</span><span className="num font-bold">{faNum(profile.activeProjects)}</span></li>
            </ul>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-bold">بار کاری فعلی</p>
            <p className="mt-1 text-[0.7rem] leading-6 text-muted">{faNum(projects.length)} پروژه در پنل شما ثبت شده است. برای ارجاع پروژه جدید، ظرفیت آزاد باید حداقل ۲۰٪ باشد.</p>
            <Button className="mt-2 w-full" size="sm" variant="ghost" onClick={() => toast("درخواست افزایش ظرفیت ثبت شد (دمو).")}>درخواست افزایش ظرفیت</Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

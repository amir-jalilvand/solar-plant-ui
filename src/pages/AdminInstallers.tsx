import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, CardHeader, ErrorState, PageHeader, ProgressBar, SearchBox, SkeletonTable } from "../components/ui";
import { Icon } from "../components/Icon";
import { useMockQuery } from "../lib/demo";
import { installers, projectsOfInstaller } from "../lib/data";
import { faNum, num1 } from "../lib/format";

export default function AdminInstallers() {
  const [query, setQuery] = useState("");
  const q = useMockQuery(() => installers, []);

  if (q.status === "loading") return <Card><SkeletonTable rows={5} /></Card>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const list = (q.data ?? []).filter((i) => !query || i.name.includes(query) || i.manager.includes(query));

  return (
    <div>
      <PageHeader
        title="نصابان و پیمانکاران"
        subtitle="صلاحیت، ظرفیت، بار کاری و کیفیت خدمات"
        actions={<Button variant="accent" icon="plus">افزودن نصاب</Button>}
      />

      <Card className="mb-3 flex flex-wrap items-center gap-2 p-3">
        <SearchBox value={query} onChange={setQuery} placeholder="جست‌وجوی نام شرکت یا مدیر…" className="w-full sm:w-72" />
        <span className="mr-auto text-[0.7rem] text-muted">{faNum(list.length)} نصاب فعال</span>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((ins) => {
          const active = projectsOfInstaller(ins.name).length;
          return (
            <Card key={ins.id}>
              <CardHeader
                title={ins.name}
                subtitle={`مدیرعامل: ${ins.manager}`}
                icon="building"
                action={<Badge tone={ins.docsStatus === "complete" ? "success" : ins.docsStatus === "expired" ? "danger" : "warn"} dot>{ins.docsStatus === "complete" ? "مدارک کامل" : ins.docsStatus === "expired" ? "منقضی" : "ناقص"}</Badge>}
              />
              <div className="space-y-2 p-3 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-bg/70 p-2">
                    <p className="num text-sm font-extrabold">{num1(ins.score)}</p>
                    <p className="text-[0.6rem] text-muted">امتیاز</p>
                  </div>
                  <div className="rounded-lg bg-bg/70 p-2">
                    <p className="num text-sm font-extrabold">{faNum(active)}</p>
                    <p className="text-[0.6rem] text-muted">پروژه فعال</p>
                  </div>
                  <div className="rounded-lg bg-bg/70 p-2">
                    <p className="num text-sm font-extrabold">{faNum(ins.completedProjects)}</p>
                    <p className="text-[0.6rem] text-muted">تکمیل‌شده</p>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[0.65rem] text-muted"><span>استفاده از ظرفیت</span><span className="num">{faNum(Math.min(100, Math.round((active * 25) / ins.capacityKw * 100)))}٪</span></div>
                  <ProgressBar value={Math.min(100, Math.round((active * 25) / ins.capacityKw * 100))} tone="info" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {ins.regions.map((r) => <Badge key={r} tone="neutral">{r}</Badge>)}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[0.65rem] text-muted">نرخ رد مدارک: <span className="num font-bold text-danger">{faNum(ins.rejectionRate)}٪</span></span>
                  <Link to="/admin/evaluation" className="btn btn-ghost btn-sm">ارزیابی</Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4 p-3">
        <p className="flex items-center gap-1.5 text-[0.7rem] text-muted"><Icon name="shield" size={13} /> تخصیص پروژه جدید فقط به نصابانی امکان‌پذیر است که مدارک معتبر و ظرفیت آزاد دارند.</p>
      </Card>
    </div>
  );
}

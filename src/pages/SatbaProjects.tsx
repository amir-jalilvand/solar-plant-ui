import { Card, ErrorState, PageHeader, SkeletonTable } from "../components/ui";
import { Icon } from "../components/Icon";
import { ProjectsTable } from "../components/ProjectBits";
import { useMockQuery } from "../lib/demo";
import { projects } from "../lib/data";

export default function SatbaProjects() {
  const q = useMockQuery(() => projects, []);

  return (
    <div>
      <PageHeader title="فهرست پروژه‌ها" subtitle="دسترسی خواندنی — بدون امکان ویرایش یا تأیید" />

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-line-soft bg-card px-3 py-2 text-[0.7rem] text-muted">
        <Icon name="lock" size={14} />
        برای دریافت جزئیات کامل هر پروژه، روی ردیف کلیک کنید. تغییر وضعیت از طریق این پنل امکان‌پذیر نیست.
      </div>

      {q.status === "loading" ? <Card><SkeletonTable rows={6} /></Card> : q.status === "error" ? <Card><ErrorState onRetry={q.reload} /></Card> : <ProjectsTable projects={q.data ?? []} />}
    </div>
  );
}

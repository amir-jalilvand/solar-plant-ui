import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, EmptyState, ErrorState, PageHeader, ProgressBar, SkeletonTable, cn } from "../components/ui";
import { Icon } from "../components/Icon";
import { ProjectsTable } from "../components/ProjectBits";
import { useMockQuery } from "../lib/demo";
import { projects } from "../lib/data";
import { faNum, num1 } from "../lib/format";
import { STAGES } from "../lib/labels";

export default function AdminProjects() {
  const [view, setView] = useState<"table" | "kanban">(() => (new URLSearchParams(window.location.search).get("view") === "kanban" ? "kanban" : "table"));
  const q = useMockQuery(() => projects, []);

  if (q.status === "loading") return <Card><SkeletonTable rows={6} /></Card>;
  if (q.status === "error") return <ErrorState onRetry={q.reload} />;

  const list = q.data ?? [];

  return (
    <div>
      <PageHeader
        title="مدیریت پروژه‌ها"
        subtitle="نمای جدولی و کانبان بر اساس مرحله چرخه عمر"
        actions={
          <div className="flex rounded-xl border border-line bg-card p-0.5" role="group" aria-label="نوع نمایش">
            <button type="button" onClick={() => setView("table")} className={cn("btn btn-sm", view === "table" ? "btn-primary" : "btn-ghost")} aria-pressed={view === "table"}>
              <Icon name="grid" size={14} /> جدول
            </button>
            <button type="button" onClick={() => setView("kanban")} className={cn("btn btn-sm", view === "kanban" ? "btn-primary" : "btn-ghost")} aria-pressed={view === "kanban"}>
              <Icon name="folder" size={14} /> کانبان
            </button>
          </div>
        }
      />

      {q.isEmpty || list.length === 0 ? (
        <Card><EmptyState icon="folder" title="پروژه‌ای وجود ندارد" /></Card>
      ) : view === "table" ? (
        <ProjectsTable projects={list} />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-3">
          {STAGES.map((stage) => {
            const items = list.filter((p) => p.stage === stage.key);
            return (
              <section key={stage.key} className="w-64 shrink-0 rounded-xl border border-line-soft bg-bg/40 p-2">
                <header className="mb-2 flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold">{stage.short}</h2>
                  <span className="num rounded-full bg-card px-2 py-0.5 text-[0.65rem] font-bold text-muted">{faNum(items.length)}</span>
                </header>
                <div className="space-y-2">
                  {items.map((p) => (
                    <Link key={p.id} to={`/projects/${p.id}`} className="block rounded-lg border border-line-soft bg-card p-2.5 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex items-center justify-between gap-1">
                        <span className="num text-[0.7rem] font-bold">{p.code}</span>
                        <Badge tone={p.subStage === "blocked" || p.subStage === "rejected" ? "danger" : p.subStage === "waiting_review" ? "warn" : "info"}>{p.subStage === "blocked" ? "متوقف" : p.subStage === "rejected" ? "رد" : p.subStage === "waiting_review" ? "بررسی" : "جاری"}</Badge>
                      </div>
                      <p className="mt-1 truncate text-[0.7rem]">{p.applicantName}</p>
                      <p className="text-[0.6rem] text-muted">{num1(p.capacityKw)} کیلووات — {p.city}</p>
                      <ProgressBar value={p.progress} className="mt-1.5" tone={p.subStage === "blocked" ? "danger" : "accent"} />
                    </Link>
                  ))}
                  {items.length === 0 ? <p className="px-1 py-4 text-center text-[0.65rem] text-muted">خالی</p> : null}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

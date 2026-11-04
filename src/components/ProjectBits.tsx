import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { Badge, Card, EmptyState, Pagination, ProgressBar, SearchBox, Select, StatusBadge, cn } from "./ui";
import { STAGES, stageLabel } from "../lib/labels";
import { faNum, jalaliShort, num1 } from "../lib/format";
import type { Project, SubStage } from "../lib/types";

export function ProjectsTable({ projects, compact = false }: { projects: Project[]; compact?: boolean }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [sub, setSub] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = compact ? 6 : 8;

  const filtered = useMemo(() => {
    const q = query.trim();
    return projects.filter((p) => {
      const matchQuery = !q || [p.code, p.applicantName, p.city, p.installerName].some((v) => v.includes(q));
      const matchStage = stage === "all" || p.stage === stage;
      const matchSub = sub === "all" || p.subStage === (sub as SubStage);
      return matchQuery && matchStage && matchSub;
    });
  }, [projects, query, stage, sub]);

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const reset = () => {
    setQuery("");
    setStage("all");
    setSub("all");
    setPage(1);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line-soft p-3">
        <SearchBox value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="جست‌وجوی کد، متقاضی، شهر…" className="w-full sm:w-64" />
        <Select
          aria-label="فیلتر مرحله"
          value={stage}
          onChange={(e) => { setStage(e.target.value); setPage(1); }}
          className="w-auto min-w-36 text-xs"
        >
          <option value="all">همه مراحل</option>
          {STAGES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </Select>
        <Select
          aria-label="فیلتر وضعیت"
          value={sub}
          onChange={(e) => { setSub(e.target.value); setPage(1); }}
          className="w-auto min-w-32 text-xs"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="in_progress">در حال انجام</option>
          <option value="waiting_review">منتظر بررسی</option>
          <option value="approved">تأیید شده</option>
          <option value="rejected">رد شده</option>
          <option value="blocked">متوقف</option>
        </Select>
        {(query || stage !== "all" || sub !== "all") && (
          <button type="button" onClick={reset} className="btn btn-ghost btn-sm">
            <Icon name="close" size={13} /> پاک‌کردن
          </button>
        )}
        <span className="mr-auto text-[0.7rem] text-muted">{faNum(filtered.length)} پروژه</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon="search"
          title="پروژه‌ای با این مشخصات پیدا نشد"
          description="فیلترها را تغییر دهید یا عبارت جست‌وجو را کوتاه‌تر کنید."
          action={<button type="button" className="btn btn-ghost btn-sm" onClick={reset}>حذف فیلترها</button>}
        />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>کد پروژه</th>
                <th>متقاضی</th>
                <th className="hidden sm:table-cell">ظرفیت</th>
                <th>مرحله</th>
                <th>وضعیت</th>
                <th className="hidden md:table-cell">پیشرفت</th>
                <th className="hidden lg:table-cell">آخرین به‌روزرسانی</th>
                <th aria-label="جزئیات" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="cursor-pointer">
                  <td>
                    <Link to={`/projects/${p.id}`} onClick={(e) => e.stopPropagation()} className="num font-bold text-ink hover:text-warn">
                      {p.code}
                    </Link>
                    <p className="text-[0.65rem] text-muted">{p.city}</p>
                  </td>
                  <td>
                    <p className="text-xs font-semibold">{p.applicantName}</p>
                    <p className="text-[0.65rem] text-muted">{p.applicantType}</p>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="num">{num1(p.capacityKw)}</span> <span className="text-[0.65rem] text-muted">کیلووات</span>
                  </td>
                  <td className="text-xs">{stageLabel(p.stage)}</td>
                  <td>
                    <StatusBadge status={p.subStage} />
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={p.progress} className="w-16" tone={p.subStage === "blocked" ? "danger" : "accent"} />
                      <span className="num text-[0.7rem] text-muted">{faNum(p.progress)}٪</span>
                    </div>
                  </td>
                  <td className="hidden text-[0.7rem] text-muted lg:table-cell">{jalaliShort(p.updatedAt)}</td>
                  <td>
                    <Icon name="chevronLeft" size={15} className="text-muted" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > pageSize ? <Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} /> : null}
    </Card>
  );
}

export function ProjectMiniCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.id}`} className="card block p-4 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="num text-xs font-bold text-muted">{project.code}</p>
          <p className="mt-1 text-sm font-bold">{project.applicantName}</p>
        </div>
        <StatusBadge status={project.subStage} />
      </div>
      <div className="mt-3 flex items-center gap-3 text-[0.7rem] text-muted">
        <span className="flex items-center gap-1"><Icon name="pin" size={12} /> {project.city}</span>
        <span className="flex items-center gap-1"><Icon name="zap" size={12} /> {num1(project.capacityKw)} کیلووات</span>
      </div>
      <p className="mt-2 truncate text-xs">{stageLabel(project.stage)}</p>
      <div className="mt-2 flex items-center gap-2">
        <ProgressBar value={project.progress} tone={project.subStage === "blocked" ? "danger" : "accent"} />
        <span className="num shrink-0 text-[0.65rem] text-muted">{faNum(project.progress)}٪</span>
      </div>
    </Link>
  );
}

export function NextActionCard({ project }: { project: Project }) {
  return (
    <div className={cn("rounded-xl border p-4", project.subStage === "blocked" || project.subStage === "rejected" ? "border-danger/30 bg-danger-soft/50" : "border-accent/40 bg-accent-soft/60")}>
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-accent text-[#1a1205]">
          <Icon name="zap" size={15} />
        </span>
        <p className="text-sm font-extrabold">اقدام بعدی: الان از من چه چیزی لازم است؟</p>
      </div>
      <p className="mt-2 text-sm leading-7">{project.nextAction}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Badge tone="warn">مسئول: {project.nextActionOwner}</Badge>
        <Link to={`/projects/${project.id}`} className="btn btn-primary btn-sm mr-auto">
          مشاهده و انجام
          <Icon name="chevronLeft" size={14} />
        </Link>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Icon } from "./Icon";
import { Badge, StatusBadge, cn } from "./ui";
import { STAGES, SUBSTAGE, stageIndex } from "../lib/labels";
import { faNum, jalali } from "../lib/format";
import type { Project } from "../lib/types";
import { documentsOf, eventsOf } from "../lib/data";

const ownerOf = (stage: string): string => {
  switch (stage) {
    case "request":
      return "متقاضی";
    case "financing":
      return "کارشناس مالی";
    case "installer_assignment":
      return "مدیر سکو";
    case "execution":
      return "نصاب";
    case "testing":
      return "کارشناس فنی";
    case "handover":
      return "متقاضی و نصاب";
    default:
      return "پشتیبانی";
  }
};

export function ProjectStepper({ project, tone = "light" }: { project: Project; tone?: "light" | "dark" }) {
  const current = stageIndex(project.stage);
  const [selected, setSelected] = useState<number>(current);
  const events = eventsOf(project.id);
  const docs = documentsOf(project.id);
  const stage = STAGES[selected];
  const dark = tone === "dark";
  const step = 100 / STAGES.length;
  const span = ((STAGES.length - 1) / STAGES.length) * 100;

  return (
    <div>
      <div className="relative pt-1">
        <div
          className={cn("absolute top-[1.15rem] h-0.5 rounded-full", dark ? "bg-white/15" : "bg-line")}
          style={{ right: `${step / 2}%`, width: `${span}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute right-[7.14%] top-[1.15rem] h-0.5 rounded-full bg-accent transition-all"
          style={{ width: `calc(${span}% * ${current / (STAGES.length - 1)})` }}
          aria-hidden="true"
        />
        <ol className="relative flex w-full items-start" aria-label="مراحل پروژه">
          {STAGES.map((s, i) => {
            const state = i < current ? "done" : i === current ? "active" : "todo";
            const isSelected = selected === i;
            return (
              <li key={s.key} className="flex min-w-0 flex-1 flex-col items-center">
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-current={state === "active" ? "step" : undefined}
                  aria-label={`${s.label} — ${state === "done" ? "انجام شده" : state === "active" ? "مرحله فعلی" : "در انتظار"}`}
                  className="flex w-full flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full border-2 text-[0.7rem] font-bold transition-all",
                      state === "done" && "border-success bg-success text-white",
                      state === "active" && "border-accent bg-accent text-[#1a1205]",
                      state === "todo" && (dark ? "border-white/25 bg-[#182a40] text-white/50" : "border-line bg-card text-muted"),
                      isSelected && "ring-4",
                      isSelected && (dark ? "ring-white/15" : "ring-accent/20"),
                    )}
                  >
                    {state === "done" ? <Icon name="check" size={15} /> : faNum(i + 1)}
                  </span>
                  <span className={cn("line-clamp-2 max-w-full px-0.5 text-center text-[0.63rem] leading-4", dark ? (state === "todo" ? "text-white/40" : "font-semibold text-white/85") : state === "todo" ? "text-muted" : "font-semibold text-ink")}>{s.short}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={cn("mt-3 rounded-xl border p-3.5", dark ? "border-white/10 bg-white/[0.06]" : "border-line-soft bg-bg/60")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-bold", dark && "text-white")}>{stage.label}</span>
            {selected === current ? <StatusBadge status={project.subStage} /> : <Badge tone="neutral">{selected < current ? "انجام شده" : "در انتظار"}</Badge>}
          </div>
          <span className={cn("text-[0.7rem]", dark ? "text-white/50" : "text-muted")}>مسئول: {ownerOf(stage.key)}</span>
        </div>
        <div className={cn("mt-1.5 grid gap-1.5 text-[0.7rem] sm:grid-cols-3", dark ? "text-white/55" : "text-muted")}>
          <span className="flex items-center gap-1">
            <Icon name="calendar" size={12} />
            آخرین رویداد: {events.find((e) => e.action.includes(stage.label))?.at ? jalali(events.find((e) => e.action.includes(stage.label))!.at) : "—"}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="file" size={12} /> مدارک مرتبط: {faNum(docs.length)} مورد
          </span>
          <span className="flex items-center gap-1">
            <Icon name="clock" size={12} /> وضعیت: {SUBSTAGE[project.subStage].label}
          </span>
        </div>
      </div>
    </div>
  );
}

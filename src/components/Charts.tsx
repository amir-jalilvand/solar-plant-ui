import { faNum } from "../lib/format";

export const CHART_COLORS = ["var(--c-accent)", "var(--c-info)", "var(--c-success)", "var(--c-danger)", "var(--c-warn)", "var(--c-muted)"];

export function Donut({ data, size = 160, thickness = 16, center }: { data: { label: string; value: number }[]; size?: number; thickness?: number; center?: { label: string; value: string } }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="نمودار دونات">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--c-line-soft)" strokeWidth={thickness} />
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {data.map((d, i) => {
              const len = (d.value / total) * c;
              const dash = `${Math.max(0, len - 2)} ${c - Math.max(0, len - 2)}`;
              const el = (
                <circle
                  key={d.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  strokeWidth={thickness}
                  strokeDasharray={dash}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                >
                  <title>{`${d.label}: ${faNum(d.value)}`}</title>
                </circle>
              );
              offset += len;
              return el;
            })}
          </g>
        </svg>
        {center ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="num text-lg font-extrabold">{center.value}</span>
            <span className="text-[0.65rem] text-muted">{center.label}</span>
          </div>
        ) : null}
      </div>
      <ul className="space-y-1.5 text-xs">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="text-muted">{d.label}</span>
            <span className="num font-bold">{faNum(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarChart({ data, height = 150 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2" style={{ height }} role="img" aria-label="نمودار ستونی">
      {data.map((d) => (
        <div key={d.label} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          <span className="num text-[0.65rem] font-bold text-muted">{faNum(d.value)}</span>
          <div
            className="w-full max-w-10 rounded-t-md bg-accent/85 transition-colors group-hover:bg-accent"
            style={{ height: `${Math.max(4, (d.value / max) * (height - 46))}px` }}
            title={`${d.label}: ${faNum(d.value)}`}
          />
          <span className="line-clamp-2 h-7 text-center text-[0.6rem] leading-3 text-muted">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ values, labels, height = 140 }: { values: number[]; labels: string[]; height?: number }) {
  const max = Math.max(...values) * 1.15;
  const min = Math.min(...values) * 0.85;
  const w = 320;
  const h = 100;
  const points = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * w;
    const y = h - ((v - min) / Math.max(1, max - min)) * h;
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <div role="img" aria-label="نمودار روند" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--c-accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--c-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="var(--c-line-soft)" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill="url(#lineFill)" />
        <path d={path} fill="none" stroke="var(--c-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="var(--c-card)" stroke="var(--c-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[0.6rem] text-muted">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

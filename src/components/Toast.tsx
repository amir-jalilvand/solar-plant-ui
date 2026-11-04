import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

type Tone = "success" | "danger" | "info" | "warn";

interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}

interface ToastCtx {
  toast: (message: string, tone?: Tone) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

const toneClass: Record<Tone, string> = {
  success: "border-success/40 bg-success-soft text-success",
  danger: "border-danger/40 bg-danger-soft text-danger",
  info: "border-info/40 bg-info-soft text-info",
  warn: "border-warn/40 bg-warn-soft text-warn",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: Tone = "success") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 4200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[90] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${toneClass[item.tone]}`}
          >
            <Icon name={item.tone === "success" ? "checkCircle" : item.tone === "danger" ? "xCircle" : "alert"} size={18} className="mt-0.5 shrink-0" />
            <span className="leading-6">{item.message}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type DemoState = "live" | "loading" | "empty" | "error";

interface DemoCtx {
  demo: DemoState;
  setDemo: (state: DemoState) => void;
}

const Ctx = createContext<DemoCtx | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [demo, setDemo] = useState<DemoState>(() => {
    const param = new URLSearchParams(window.location.search).get("demo");
    if (param && ["live", "loading", "empty", "error"].includes(param)) return param as DemoState;
    return "live";
  });
  const value = useMemo(() => ({ demo, setDemo }), [demo]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo(): DemoCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemo must be used inside DemoStateProvider");
  return ctx;
}

/**
 * شبیه‌سازی یک کوئری شبکه: تأخیر کوتاه + چهار حالت نمایش
 * (عادی، بارگذاری، خالی، خطا) که از تنظیمات دمو خوانده می‌شود.
 */
export function useMockQuery<T>(loader: () => T, deps: unknown[] = [], delay = 380) {
  const { demo } = useDemo();
  const [data, setData] = useState<T | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (demo === "loading" || demo === "error") {
      setData(null);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) setData(loader());
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, delay, nonce, ...deps]);

  const status: "loading" | "error" | "ready" = demo === "error" ? "error" : demo === "loading" || data === null ? "loading" : "ready";

  return {
    data,
    status,
    isEmpty: demo === "empty",
    reload: () => setNonce((n) => n + 1),
  };
}

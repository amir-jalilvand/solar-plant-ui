import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Role } from "./types";
import { ROLES } from "./labels";

interface RoleCtx {
  role: Role;
  setRole: (role: Role) => void;
  user: string;
}

const Ctx = createContext<RoleCtx | null>(null);

function initialRole(): Role {
  const param = new URLSearchParams(window.location.search).get("role") as Role | null;
  if (param && param in ROLES) return param;
  try {
    const stored = localStorage.getItem("solar-role") as Role | null;
    if (stored && stored in ROLES) return stored;
  } catch {
    /* ignore */
  }
  return "applicant";
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(initialRole);

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    try {
      localStorage.setItem("solar-role", next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ role, setRole, user: ROLES[role].user }), [role, setRole]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRole(): RoleCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}

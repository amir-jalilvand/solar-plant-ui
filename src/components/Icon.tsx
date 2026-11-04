import type { SVGProps } from "react";

export type IconName =
  | "home"
  | "grid"
  | "folder"
  | "file"
  | "wallet"
  | "wrench"
  | "users"
  | "chart"
  | "bell"
  | "sun"
  | "moon"
  | "menu"
  | "close"
  | "check"
  | "checkCircle"
  | "alert"
  | "search"
  | "plus"
  | "download"
  | "upload"
  | "chevronLeft"
  | "chevronRight"
  | "chevronDown"
  | "clock"
  | "pin"
  | "zap"
  | "shield"
  | "logout"
  | "external"
  | "filter"
  | "refresh"
  | "message"
  | "star"
  | "arrowUp"
  | "arrowDown"
  | "building"
  | "user"
  | "calendar"
  | "edit"
  | "eye"
  | "lock"
  | "sparkles"
  | "xCircle"
  | "trending";

const paths: Record<IconName, string> = {
  home: "M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  file: "M6 3h8l4 4v14H6zM14 3v5h5M9 13h6M9 17h6",
  wallet: "M3 8a2 2 0 0 1 2-2h14v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 8h18M16 13h.01",
  wrench: "M14.7 6.3a4 4 0 1 0 5 5L20 12l-8 8-3-3 8-8z",
  users: "M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M17 4.2a3.5 3.5 0 0 1 0 6.6M21 20v-1.5a4 4 0 0 0-3-3.8",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  bell: "M18 8a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6M10.5 20a2 2 0 0 0 3 0",
  sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10",
  moon: "M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6 6 18",
  check: "M4 12.5 9.5 18 20 6.5",
  checkCircle: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M8 12.5 11 15l5-6",
  alert: "M12 3 2.5 20h19zM12 9v5M12 17.2h.01",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-4.2-4.2",
  plus: "M12 5v14M5 12h14",
  download: "M12 3v12M7 11l5 5 5-5M4 21h16",
  upload: "M12 21V9M7 13l5-5 5 5M4 3h16",
  chevronLeft: "M15 5l-7 7 7 7",
  chevronRight: "M9 5l7 7-7 7",
  chevronDown: "M5 9l7 7 7-7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3 2",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
  zap: "M13 2 4 14h7l-1 8 9-12h-7z",
  shield: "M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6zM9 12l2 2 4-4",
  logout: "M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h10",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  filter: "M3 5h18l-7 8v6l-4-2v-4z",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  message: "M21 12a8 8 0 0 1-8 8H8l-5 3 1.4-4.2A8 8 0 1 1 21 12Z",
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z",
  arrowUp: "M12 20V5M6 11l6-6 6 6",
  arrowDown: "M12 4v15M6 13l6 6 6-6",
  building: "M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M15 9h3a2 2 0 0 1 2 2v10M8 7h3M8 11h3M8 15h3M2 21h20",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  calendar: "M4 6h16v15H4zM8 3v4M16 3v4M4 10h16",
  edit: "M4 20h4L20 8l-4-4L4 16zM14 6l4 4",
  eye: "M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  lock: "M6 11h12v10H6zM9 11V7a3 3 0 0 1 6 0v4",
  sparkles: "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18 15l.9 2.3 2.3.9-2.3.9L18 21.5l-.9-2.4-2.3-.9 2.3-.9z",
  xCircle: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M9 9l6 6M15 9l-6 6",
  trending: "M3 17l6-6 4 4 7-8M14 7h6v6",
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}

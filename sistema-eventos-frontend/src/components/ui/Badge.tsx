import type { ReactNode } from "react";

const colorClasses: Record<string, string> = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
};

export function Badge({ children, color = "slate" }: { children: ReactNode; color?: keyof typeof colorClasses }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[color]}`}>
      {children}
    </span>
  );
}

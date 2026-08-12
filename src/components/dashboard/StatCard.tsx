import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: string; positive: boolean };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-indigo-600",
  iconBg = "bg-indigo-50",
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
          <span
            className={cn(
              "text-xs font-semibold",
              trend.positive ? "text-green-600" : "text-red-500"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-xs text-slate-400">vs. last month</span>
        </div>
      )}
    </div>
  );
}

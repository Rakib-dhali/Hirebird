"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useApplicationStore } from "@/store/useApplicationStore";
import { STATUS_LABELS, ApplicationStatus } from "@/types";

const STATUS_PIE_COLORS: Record<ApplicationStatus, string> = {
  APPLIED: "#3b82f6",
  PHONE_SCREEN: "#06b6d4",
  INTERVIEW: "#6366f1",
  TECHNICAL: "#8b5cf6",
  OFFER: "#22c55e",
  REJECTED: "#ef4444",
  GHOSTED: "#94a3b8",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-slate-300">{payload[0].value} applications</p>
      </div>
    );
  }
  return null;
}

export function StatusPieChart() {
  const applications = useApplicationStore((s) => s.applications);

  const counts = applications.reduce(
    (acc, app) => {
      acc[app.currentStatus] = (acc[app.currentStatus] ?? 0) + 1;
      return acc;
    },
    {} as Record<ApplicationStatus, number>
  );

  const data = (Object.entries(counts) as [ApplicationStatus, number][])
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status],
      value: count,
      color: STATUS_PIE_COLORS[status],
    }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-center h-full">
        <p className="text-sm text-slate-400">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Status Breakdown
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Current distribution across all statuses
        </p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", color: "#64748b" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Application } from "@/types";

interface WeeklyBarChartProps {
  applications: Application[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-indigo-300">{payload[0].value} applications</p>
      </div>
    );
  }
  return null;
}

export function WeeklyBarChart({ applications }: WeeklyBarChartProps) {
  const data = useMemo(() => {
    const weeks = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const count = applications.filter((app) => {
        const appliedDate = new Date(app.appliedAt);
        return appliedDate >= weekStart && appliedDate < weekEnd;
      }).length;

      const month = weekStart.toLocaleString("default", { month: "short" });
      const day = weekStart.getDate();
      weeks.push({
        week: `${month} ${day}`,
        applications: count,
      });
    }

    return weeks;
  }, [applications]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Weekly Applications
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Applications sent over the last 8 weeks
        </p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          barSize={24}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
          <Bar
            dataKey="applications"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

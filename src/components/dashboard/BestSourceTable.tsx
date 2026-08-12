import { AnalyticsData } from "@/types";

interface BestSourceTableProps {
  analytics: AnalyticsData | null;
}

export function BestSourceTable({ analytics }: BestSourceTableProps) {
  const data = analytics?.bySource ?? [];

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-400">
          No source data available yet. Start adding applications!
        </p>
      </div>
    );
  }

  // Sort by count descending
  const sorted = [...data].sort((a, b) => b._count - a._count);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">
          Applications by Source
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Which channels you&apos;re using most
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-medium">Source</th>
              <th className="text-right px-5 py-3 font-medium">Applications</th>
              <th className="text-right px-5 py-3 font-medium">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((row) => {
              const total = data.reduce((sum, r) => sum + r._count, 0);
              const share =
                total > 0
                  ? Math.round((row._count / total) * 100)
                  : 0;
              return (
                <tr
                  key={row.source ?? "unknown"}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-slate-700">
                    {row.source || "Unknown"}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-600">
                    {row._count}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        share >= 30
                          ? "bg-indigo-50 text-indigo-700"
                          : share >= 15
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {share}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

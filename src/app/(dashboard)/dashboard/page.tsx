"use client";

import { useEffect } from "react";
import { useApplicationStore } from "@/store/useApplicationStore";
import { StatCard } from "@/components/dashboard/StatCard";
import { BestSourceTable } from "@/components/dashboard/BestSourceTable";
import { WeeklyBarChart } from "@/components/charts/WeeklyBarChart";
import { StatusPieChart } from "@/components/charts/StatusPieChart";
import {
  Briefcase,
  MessageSquare,
  Users,
  Trophy,
} from "lucide-react";

export default function DashboardPage() {
  const {
    applications,
    analytics,
    isLoading,
    fetchApplications,
    fetchAnalytics,
  } = useApplicationStore();

  useEffect(() => {
    fetchApplications();
    fetchAnalytics();
  }, [fetchApplications, fetchAnalytics]);

  const total = analytics?.total ?? 0;
  const responseRate = analytics?.responseRate ?? 0;

  const activeInterviews =
    analytics?.byStatus
      ?.filter(
        (s) => s.currentStatus === "INTERVIEW" || s.currentStatus === "TECHNICAL"
      )
      .reduce((sum, s) => sum + s._count, 0) ?? 0;

  const offers =
    analytics?.byStatus
      ?.find((s) => s.currentStatus === "OFFER")
      ?._count ?? 0;

  if (isLoading && !analytics) {
    return (
      <div className="p-6 space-y-6 max-w-7xl">
        {/* Skeleton stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-5 h-32 animate-pulse"
            >
              <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
              <div className="h-8 w-16 bg-slate-200 rounded mb-2" />
              <div className="h-2 w-20 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        {/* Skeleton charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 h-72 animate-pulse" />
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 h-72 animate-pulse" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 h-48 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={total}
          subtitle="All time"
          icon={Briefcase}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Response Rate"
          value={`${responseRate}%`}
          subtitle="Excluding ghosted"
          icon={MessageSquare}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-50"
        />
        <StatCard
          title="Active Interviews"
          value={activeInterviews}
          subtitle="In progress now"
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Offers Received"
          value={offers}
          subtitle={offers === 1 ? "1 open offer" : `${offers} open offers`}
          icon={Trophy}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 min-w-0">
          <WeeklyBarChart applications={applications} />
        </div>
        <div className="lg:col-span-2 min-w-0">
          <StatusPieChart />
        </div>
      </div>

      {/* Source Table */}
      <div className="min-w-0">
        <BestSourceTable analytics={analytics} />
      </div>
    </div>
  );
}

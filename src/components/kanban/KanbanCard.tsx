"use client";

import { forwardRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Application, STATUS_COLORS, STATUS_LABELS } from "@/types";
import { formatDate, formatSalary } from "@/lib/utils";
import { ExternalLink, MapPin, Calendar } from "lucide-react";

const SOURCE_BADGE_COLORS: Record<string, string> = {
  LinkedIn: "bg-blue-50 text-blue-700",
  Indeed: "bg-orange-50 text-orange-700",
  Arc: "bg-violet-50 text-violet-700",
  AngelList: "bg-amber-50 text-amber-700",
  Glassdoor: "bg-green-50 text-green-700",
  Referral: "bg-emerald-50 text-emerald-700",
  "Company Website": "bg-slate-100 text-slate-600",
  Other: "bg-gray-100 text-gray-600",
};

interface KanbanCardViewProps {
  application: Application;
  style?: React.CSSProperties;
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
  isOverlay?: boolean;
  isDragging?: boolean;
}

export const KanbanCardView = forwardRef<HTMLDivElement, KanbanCardViewProps>(
  ({ application, style, listeners, attributes, isOverlay, isDragging }, ref) => {
    const router = useRouter();
    const salary = formatSalary(application.salaryMin, application.salaryMax);
    const sourceBadge =
      SOURCE_BADGE_COLORS[application.source ?? ""] ?? "bg-gray-100 text-gray-600";
    const statusColor = STATUS_COLORS[application.currentStatus];

    const handleCardClick = (e: React.MouseEvent) => {
      if (isOverlay) return;
      // If clicking a link, do not trigger navigation
      if ((e.target as HTMLElement).closest("a")) {
        return;
      }
      router.push(`/applications/${application.id}`);
    };

    return (
      <div
        ref={ref}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleCardClick}
        className={`relative bg-white rounded-lg border p-3.5 shadow-sm transition-all duration-150 select-none group ${
          isOverlay
            ? "cursor-grabbing shadow-lg border-indigo-400 rotate-2 scale-105"
            : isDragging
            ? "opacity-50 border-slate-200 cursor-grabbing"
            : "hover:shadow-md hover:border-slate-300 cursor-pointer"
        }`}
      >
        {/* Company + link */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="text-sm font-semibold text-slate-800 leading-tight">
            {application.company.name}
          </p>
          {application.jobUrl && (
            <Link
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 text-slate-300 hover:text-indigo-500 transition-colors z-10"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Role */}
        <p className="text-xs text-slate-500 mb-3 leading-snug">
          {application.role}
        </p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {/* Source */}
          {application.source && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${sourceBadge}`}
            >
              {application.source}
            </span>
          )}

          {/* Salary */}
          {salary && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-600">
              <MapPin className="w-2.5 h-2.5" />
              {salary}
            </span>
          )}
        </div>

        {/* Footer: date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar className="w-3 h-3" />
            {formatDate(application.appliedAt)}
          </div>
          {/* Status dot */}
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
            {STATUS_LABELS[application.currentStatus]}
          </span>
        </div>
      </div>
    );
  }
);

KanbanCardView.displayName = "KanbanCardView";

interface KanbanCardProps {
  application: Application;
}

export function KanbanCard({ application }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    touchAction: "none",
  };

  return (
    <KanbanCardView
      ref={setNodeRef}
      style={style}
      listeners={listeners}
      attributes={attributes}
      application={application}
      isDragging={isDragging}
    />
  );
}
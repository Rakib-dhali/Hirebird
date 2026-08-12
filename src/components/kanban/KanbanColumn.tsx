"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Application, ApplicationStatus, STATUS_COLORS, STATUS_LABELS } from "@/types";
import { KanbanCard } from "./KanbanCard";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  isOver?: boolean;
}

export function KanbanColumn({
  status,
  applications,
  isOver,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  const colors = STATUS_COLORS[status];

  return (
    <div className="flex flex-col w-72 shrink-0 h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
          <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {STATUS_LABELS[status]}
          </h2>
        </div>
        <span
          className={cn(
            "flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold border",
            colors.bg,
            colors.text,
            colors.border
          )}
        >
          {applications.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto rounded-xl p-2.5 transition-colors duration-150 scrollbar-none",
          isOver ? "bg-indigo-50 ring-2 ring-indigo-300 ring-inset" : "bg-slate-100/60"
        )}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <KanbanCard key={app.id} application={app} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-slate-200 shrink-0">
            <p className="text-xs text-slate-400">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}

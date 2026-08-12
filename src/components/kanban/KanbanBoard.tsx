"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useApplicationStore } from "@/store/useApplicationStore";
import { ApplicationStatus, COLUMN_ORDER } from "@/types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCardView } from "./KanbanCard";

export function KanbanBoard() {
  const { applications, moveApplication } = useApplicationStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drags when clicking
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeAppId = active.id as string;
    const overId = over.id as string; // Could be a column ID (ApplicationStatus) or another card ID

    const activeApp = applications.find((app) => app.id === activeAppId);
    if (!activeApp) return;

    // Check if dragged over a column directly
    if (COLUMN_ORDER.includes(overId as ApplicationStatus)) {
      if (activeApp.currentStatus !== overId) {
        moveApplication(activeAppId, overId as ApplicationStatus);
      }
      return;
    }

    // Check if dragged over another card
    const overApp = applications.find((app) => app.id === overId);
    if (overApp && activeApp.currentStatus !== overApp.currentStatus) {
      moveApplication(activeAppId, overApp.currentStatus);
    }
  };

  const activeApp = applications.find((app) => app.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 h-full w-full">
        {COLUMN_ORDER.map((status) => {
          const columnApps = applications.filter((app) => app.currentStatus === status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              applications={columnApps}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeApp ? <KanbanCardView application={activeApp} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

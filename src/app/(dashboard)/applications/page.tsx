"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useApplicationStore } from "@/store/useApplicationStore";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { AddApplicationModal } from "@/components/modals/AddApplicationModal";

export default function ApplicationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchApplications, isLoading, applications } = useApplicationStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex flex-col h-[calc(100vh-56px)]">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Job Applications
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage and track all your applications through the pipeline
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-indigo-500/10 transition-all cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Board Container */}
      <div className="flex-1 min-h-0 -mx-4 sm:mx-0 px-4 sm:px-0">
        {isLoading && applications.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Loading applications...</p>
            </div>
          </div>
        ) : (
          <KanbanBoard />
        )}
      </div>

      {/* Modal */}
      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

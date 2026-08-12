"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { SOURCE_OPTIONS, ApplicationSource } from "@/types";
import { useApplicationStore } from "@/store/useApplicationStore";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddApplicationModal({ isOpen, onClose }: AddApplicationModalProps) {
  const addApplication = useApplicationStore((state) => state.addApplication);
  
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [source, setSource] = useState<ApplicationSource>("LinkedIn");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addApplication({
        companyName,
        companyWebsite: companyWebsite || undefined,
        role,
        jobUrl: jobUrl || undefined,
        salaryMin: salaryMin ? parseInt(salaryMin, 10) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax, 10) : undefined,
        source,
      });

      // Reset form
      setCompanyName("");
      setCompanyWebsite("");
      setRole("");
      setJobUrl("");
      setSalaryMin("");
      setSalaryMax("");
      setSource("LinkedIn");

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 animate-[card-enter_0.3s_cubic-bezier(0.22,1,0.36,1)_both] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-800">Add New Application</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="companyName" className="text-xs font-semibold text-slate-600">
                Company Name *
              </label>
              <input
                id="companyName"
                type="text"
                required
                placeholder="Google"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-xs font-semibold text-slate-600">
                Role *
              </label>
              <input
                id="role"
                type="text"
                required
                placeholder="Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Company Website */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="companyWebsite" className="text-xs font-semibold text-slate-600">
              Company Website
            </label>
            <input
              id="companyWebsite"
              type="url"
              placeholder="https://google.com"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Job URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="jobUrl" className="text-xs font-semibold text-slate-600">
              Job Posting URL
            </label>
            <input
              id="jobUrl"
              type="url"
              placeholder="https://careers.google.com/jobs/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Salary Min */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="salaryMin" className="text-xs font-semibold text-slate-600">
                Salary Min ($)
              </label>
              <input
                id="salaryMin"
                type="number"
                placeholder="100000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Salary Max */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="salaryMax" className="text-xs font-semibold text-slate-600">
                Salary Max ($)
              </label>
              <input
                id="salaryMax"
                type="number"
                placeholder="150000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Source Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="source" className="text-xs font-semibold text-slate-600">
              Source
            </label>
            <select
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value as ApplicationSource)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSubmitting ? "Adding..." : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

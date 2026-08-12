"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApplicationStore } from "@/store/useApplicationStore";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  ApplicationStatus,
  COLUMN_ORDER,
  SOURCE_OPTIONS,
  ApplicationSource,
} from "@/types";
import { formatDate, formatSalary } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Mail,
  User,
  Trash2,
  Edit2,
  Check,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    currentApplication: application,
    fetchApplication,
    updateApplication,
    deleteApplication,
    moveApplication,
    addNote,
    deleteNote,
    addContact,
    deleteContact,
    isLoading,
  } = useApplicationStore();

  // Fetch on mount
  useEffect(() => {
    if (id) {
      fetchApplication(id);
    }
  }, [id, fetchApplication]);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [source, setSource] = useState<ApplicationSource>("LinkedIn");
  const [status, setStatus] = useState<ApplicationStatus>("APPLIED");

  // Contact form states
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactLinkedin, setNewContactLinkedin] = useState("");
  const [newContactRole, setNewContactRole] = useState("");

  // Note form state
  const [newNoteContent, setNewNoteContent] = useState("");

  // Status change note
  const [statusChangeNote, setStatusChangeNote] = useState("");

  if (isLoading && !application) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application || application.id !== id) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Application not found.</p>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-indigo-600 hover:underline mt-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to applications
        </Link>
      </div>
    );
  }

  const startEditing = () => {
    setRole(application.role);
    setJobUrl(application.jobUrl || "");
    setSalaryMin(application.salaryMin?.toString() || "");
    setSalaryMax(application.salaryMax?.toString() || "");
    setSource((application.source as ApplicationSource) || "LinkedIn");
    setStatus(application.currentStatus);
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateApplication(application.id, {
      role,
      jobUrl: jobUrl || undefined,
      salaryMin: salaryMin ? parseInt(salaryMin, 10) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax, 10) : undefined,
      source,
    });

    // If status changed, update it separately via the status API
    if (status !== application.currentStatus) {
      await moveApplication(application.id, status);
    }

    // Re-fetch to get fresh data
    await fetchApplication(application.id);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete your application for ${application.company.name}?`)) {
      await deleteApplication(application.id);
      router.push("/applications");
    }
  };

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    await addNote(application.id, newNoteContent.trim());
    setNewNoteContent("");
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId, application.id);
  };

  const handleAddContact = async () => {
    if (!newContactName.trim()) return;
    await addContact(application.id, {
      name: newContactName.trim(),
      email: newContactEmail || undefined,
      linkedin: newContactLinkedin || undefined,
      role: newContactRole || undefined,
    });
    setNewContactName("");
    setNewContactEmail("");
    setNewContactLinkedin("");
    setNewContactRole("");
    setShowContactForm(false);
  };

  const handleDeleteContact = async (contactId: string) => {
    await deleteContact(contactId, application.id);
  };

  const statusColor = STATUS_COLORS[application.currentStatus];
  const salary = formatSalary(application.salaryMin, application.salaryMax);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl">
      {/* Back Button */}
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Applications</span>
      </Link>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-violet-600" />
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-2">
          {/* Company + Title */}
          <div className="space-y-1.5 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                {STATUS_LABELS[application.currentStatus]}
              </span>
              <span className="text-xs text-slate-400">
                Applied {formatDate(application.appliedAt)}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-2 mt-2">
                <p className="text-xl font-bold text-slate-800">
                  {application.company.name}
                </p>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role Title"
                  className="block w-full sm:w-auto px-2.5 py-1 text-sm text-slate-500 border border-slate-200 rounded-md focus:outline-indigo-500"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight break-words">
                  {application.company.name}
                </h1>
                <p className="text-sm font-medium text-slate-500 break-words">
                  {application.role}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={startEditing}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Editing Grid Details */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Job URL</label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://..."
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as ApplicationSource)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Min Salary ($)</label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="100000"
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Max Salary ($)</label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="150000"
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Pipeline Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {COLUMN_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Read-Only Stats Row */}
        {!isEditing && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400">Salary Range</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {salary || "Not Specified"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Source</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {application.source || "Not Specified"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Job URL</p>
              <div className="mt-0.5">
                {application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    <span>View Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-slate-400">None</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400">Last Updated</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {formatDate(application.updatedAt)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Details & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Notes & Contacts (2 Cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Notes Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">Notes</h2>
              <span className="text-xs text-slate-400">{application.notes.length} note{application.notes.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Add note form */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a note..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddNote();
                }}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
                className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {/* Notes list */}
            <div className="space-y-2">
              {application.notes.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No notes yet.</p>
              ) : (
                application.notes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 group"
                  >
                    <div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{formatDate(note.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="shrink-0 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">Contacts</h2>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Add Contact
              </button>
            </div>

            {/* Add contact form */}
            {showContactForm && (
              <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Name *</label>
                    <input
                      type="text"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      placeholder="Recruiter Name"
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Role</label>
                    <input
                      type="text"
                      value={newContactRole}
                      onChange={(e) => setNewContactRole(e.target.value)}
                      placeholder="Hiring Manager"
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Email</label>
                    <input
                      type="email"
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">LinkedIn</label>
                    <input
                      type="url"
                      value={newContactLinkedin}
                      onChange={(e) => setNewContactLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContact}
                    disabled={!newContactName.trim()}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    Save Contact
                  </button>
                </div>
              </div>
            )}

            {/* Contacts list */}
            <div className="space-y-3.5">
              {application.contacts.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No contacts added yet.</p>
              ) : (
                application.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-start justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-700">{contact.name}</span>
                        {contact.role && (
                          <span className="text-xs text-slate-400">• {contact.role}</span>
                        )}
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:underline">
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.linkedin && (
                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                          <FaLinkedin className="w-4 h-4 text-slate-400" />
                          <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>LinkedIn Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="shrink-0 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Remove contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Timeline History (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Status History</h2>
          
          <div className="relative pl-4 border-l border-slate-200 ml-1.5 space-y-6">
            {[...application.statusHistory]
              .sort((a, b) => COLUMN_ORDER.indexOf(b.status) - COLUMN_ORDER.indexOf(a.status))
              .map((item) => {
              const itemColor = STATUS_COLORS[item.status];
              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot */}
                  <span className={`absolute -left-[21px] mt-1.5 w-2.5 h-2.5 rounded-full border border-white ${itemColor.dot}`} />

                  {/* Header info */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      {STATUS_LABELS[item.status]}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.changedAt)}
                    </p>
                  </div>

                  {/* Optional Note */}
                  {item.note && (
                    <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-2 rounded-lg mt-1.5 leading-normal">
                      {item.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

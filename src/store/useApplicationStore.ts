import { create } from "zustand";
import {
  Application,
  ApplicationStatus,
  AddApplicationInput,
  ApiNote,
  ApiContact,
  AnalyticsData,
} from "@/types";

// ─── Store Interface ──────────────────────────────────────────────────────────

interface ApplicationStore {
  // State
  applications: Application[];
  currentApplication: Application | null;
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;

  // Fetch
  fetchApplications: () => Promise<void>;
  fetchApplication: (id: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;

  // Applications CRUD
  addApplication: (input: AddApplicationInput) => Promise<void>;
  moveApplication: (id: string, newStatus: ApplicationStatus) => Promise<void>;
  updateApplication: (
    id: string,
    updates: {
      role?: string;
      jobUrl?: string;
      salaryMin?: number;
      salaryMax?: number;
      source?: string;
    }
  ) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  getApplicationById: (id: string) => Application | undefined;

  // Notes
  addNote: (applicationId: string, content: string) => Promise<void>;
  deleteNote: (noteId: string, applicationId: string) => Promise<void>;

  // Contacts
  addContact: (
    applicationId: string,
    contact: { name: string; email?: string; linkedin?: string; role?: string }
  ) => Promise<void>;
  deleteContact: (contactId: string, applicationId: string) => Promise<void>;
}

// ─── Store Implementation ─────────────────────────────────────────────────────

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  currentApplication: null,
  analytics: null,
  isLoading: false,
  error: null,

  // ── Fetch all applications ────────────────────────────────────────────────

  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data: Application[] = await res.json();
      set({ applications: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  // ── Fetch single application (detail view) ───────────────────────────────

  fetchApplication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/applications/${id}`);
      if (!res.ok) throw new Error("Failed to fetch application");
      const data: Application = await res.json();
      set({ currentApplication: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  // ── Fetch analytics ──────────────────────────────────────────────────────

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data: AnalyticsData = await res.json();
      set({ analytics: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  // ── Add application ──────────────────────────────────────────────────────

  addApplication: async (input) => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to add application");
      const newApp: Application = await res.json();
      // Enrich with empty arrays since POST response may not include all relations
      const enriched: Application = {
        ...newApp,
        contacts: newApp.contacts ?? [],
        notes: newApp.notes ?? [],
        statusHistory: newApp.statusHistory ?? [],
      };
      set((state) => ({
        applications: [enriched, ...state.applications],
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  // ── Move application (status change) ─────────────────────────────────────

  moveApplication: async (id, newStatus) => {
    // Optimistic update
    const prevApplications = get().applications;
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, currentStatus: newStatus } : app
      ),
    }));

    try {
      const res = await fetch("/api/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id, status: newStatus }),
      });
      if (!res.ok) {
        // Rollback on failure
        set({ applications: prevApplications });
        throw new Error("Failed to update status");
      }
    } catch (err) {
      set({
        applications: prevApplications,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  // ── Update application ────────────────────────────────────────────────────

  updateApplication: async (id, updates) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update application");
      const updated: Application = await res.json();
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? { ...app, ...updated } : app
        ),
        currentApplication:
          state.currentApplication?.id === id
            ? { ...state.currentApplication, ...updated }
            : state.currentApplication,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  // ── Delete application ────────────────────────────────────────────────────

  deleteApplication: async (id) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete application");
      set((state) => ({
        applications: state.applications.filter((app) => app.id !== id),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  // ── Get by ID (local) ─────────────────────────────────────────────────────

  getApplicationById: (id) => {
    return get().applications.find((app) => app.id === id);
  },

  // ── Notes ─────────────────────────────────────────────────────────────────

  addNote: async (applicationId, content) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, content }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      const note: ApiNote = await res.json();

      set((state) => ({
        currentApplication:
          state.currentApplication?.id === applicationId
            ? {
                ...state.currentApplication,
                notes: [note, ...state.currentApplication.notes],
              }
            : state.currentApplication,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  deleteNote: async (noteId, applicationId) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");

      set((state) => ({
        currentApplication:
          state.currentApplication?.id === applicationId
            ? {
                ...state.currentApplication,
                notes: state.currentApplication.notes.filter(
                  (n) => n.id !== noteId
                ),
              }
            : state.currentApplication,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  // ── Contacts ──────────────────────────────────────────────────────────────

  addContact: async (applicationId, contact) => {
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, ...contact }),
      });
      if (!res.ok) throw new Error("Failed to add contact");
      const newContact: ApiContact = await res.json();

      set((state) => ({
        currentApplication:
          state.currentApplication?.id === applicationId
            ? {
                ...state.currentApplication,
                contacts: [
                  ...state.currentApplication.contacts,
                  newContact,
                ],
              }
            : state.currentApplication,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  deleteContact: async (contactId, applicationId) => {
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete contact");

      set((state) => ({
        currentApplication:
          state.currentApplication?.id === applicationId
            ? {
                ...state.currentApplication,
                contacts: state.currentApplication.contacts.filter(
                  (c) => c.id !== contactId
                ),
              }
            : state.currentApplication,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },
}));

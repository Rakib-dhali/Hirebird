export type ApplicationStatus =
  | "APPLIED"
  | "PHONE_SCREEN"
  | "INTERVIEW"
  | "TECHNICAL"
  | "OFFER"
  | "REJECTED"
  | "GHOSTED";

export type ApplicationSource =
  | "LinkedIn"
  | "Indeed"
  | "Arc"
  | "AngelList"
  | "Glassdoor"
  | "Referral"
  | "Company Website"
  | "Other";

// ─── API-aligned interfaces ───────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  website?: string | null;
  location?: string | null;
}

export interface StatusHistoryEntry {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  changedAt: string; // ISO date string
  note?: string | null;
}

export interface ApiContact {
  id: string;
  applicationId: string;
  name: string;
  email?: string | null;
  linkedin?: string | null;
  role?: string | null;
}

export interface ApiNote {
  id: string;
  applicationId: string;
  content: string;
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  companyId: string;
  role: string;
  jobUrl?: string | null;
  currentStatus: ApplicationStatus;
  salaryMin?: number | null;
  salaryMax?: number | null;
  source?: string | null;
  appliedAt: string; // ISO date string
  createdAt: string;
  updatedAt: string;

  // Relations (included by API)
  company: Company;
  contacts: ApiContact[];
  notes: ApiNote[];
  statusHistory: StatusHistoryEntry[];
}

export interface AddApplicationInput {
  companyName: string;
  companyWebsite?: string;
  role: string;
  jobUrl?: string;
  salaryMin?: number;
  salaryMax?: number;
  source?: ApplicationSource;
}

// ─── Analytics API response ──────────────────────────────────────────────────

export interface AnalyticsData {
  total: number;
  responseRate: number | string;
  byStatus: Array<{ currentStatus: ApplicationStatus; _count: number }>;
  bySource: Array<{ source: string; _count: number }>;
}

// ─── UI Constants ─────────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  PHONE_SCREEN: "Phone Screen",
  INTERVIEW: "Interview",
  TECHNICAL: "Technical",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
};

export const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; border: string; dot: string }> = {
  APPLIED: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  PHONE_SCREEN: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dot: "bg-cyan-500",
  },
  INTERVIEW: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  TECHNICAL: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  OFFER: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  REJECTED: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  GHOSTED: {
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
};

export const COLUMN_ORDER: ApplicationStatus[] = [
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEW",
  "TECHNICAL",
  "OFFER",
  "REJECTED",
  "GHOSTED",
];

export const SOURCE_OPTIONS: ApplicationSource[] = [
  "LinkedIn",
  "Indeed",
  "Arc",
  "AngelList",
  "Glassdoor",
  "Referral",
  "Company Website",
  "Other",
];

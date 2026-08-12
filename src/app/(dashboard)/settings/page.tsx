"use client";

import { useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import { User, Shield, Bell, AppWindow } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your account preferences, notifications, and profile details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg text-left">
            <User className="w-4 h-4" />
            <span>Profile Information</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg text-left transition-colors">
            <Shield className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg text-left transition-colors">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg text-left transition-colors">
            <AppWindow className="w-4 h-4" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
              Profile Details
            </h3>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-lg font-bold">
                {user ? getInitials(user.name || user.email) : "U"}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {user?.name || "User"}
                </h4>
                <p className="text-xs text-slate-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || ""}
                  disabled
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
              Application Preferences
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                />
                <span className="text-sm text-slate-600 font-medium">
                  Receive email reminders for scheduled interviews
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                />
                <span className="text-sm text-slate-600 font-medium">
                  Include salary range in application list cards
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                />
                <span className="text-sm text-slate-600 font-medium">
                  Auto-archive applications marked as Rejected
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  CheckSquare,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Close sidebar on route change on mobile
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out md:static md:translate-x-0 shrink-0",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
              <CheckSquare className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Hirebird
            </span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2 mb-2">
            Menu
          </p>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-white" : "text-slate-500"
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800 shrink-0">
          <p className="text-xs text-slate-600">Hirebird v1.0</p>
        </div>
      </aside>
    </>
  );
}

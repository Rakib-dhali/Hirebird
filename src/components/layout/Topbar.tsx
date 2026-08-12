"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, Menu } from "lucide-react";
import { getInitials } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/applications": "Applications",
  "/settings": "Settings",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const pageTitle =
    Object.entries(PAGE_TITLES).find(([key]) =>
      pathname.startsWith(key)
    )?.[1] ?? "Hirebird";

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="flex items-center justify-between h-14 px-4 sm:px-6 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-1.5 -ml-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {user && (
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-semibold select-none">
              {getInitials(user.name ?? user.email ?? "U")}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-700 leading-tight">
                {user.name ?? "User"}
              </p>
              <p className="text-xs text-slate-400 leading-tight truncate max-w-[150px]">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}

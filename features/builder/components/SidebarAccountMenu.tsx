"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, User2, User } from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

type Props = {
  displayName?: string;
  subtitle?: string;
  showProfile?: boolean;
};

export function SidebarAccountMenu({
  displayName = "Account",
  subtitle = "Pro Merchant",
  showProfile = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative mt-0.5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
          open ? "bg-gray-100" : "hover:bg-gray-100",
        )}
      >
        <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          <User2 className="w-3.5 h-3.5 text-gray-500" />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-gray-800 leading-tight truncate">
            {displayName}
          </span>
          <span className="text-[10px] text-gray-400 leading-tight">{subtitle}</span>
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-2 right-2 mb-1.5 rounded-xl border border-gray-200 bg-white py-1 shadow-lg shadow-gray-900/10 z-50"
        >
          {showProfile && (
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              Profile
            </Link>
          )}

          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

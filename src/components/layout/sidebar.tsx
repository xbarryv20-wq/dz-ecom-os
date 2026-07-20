"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Radar,
  Package,
  Target,
  Warehouse,
  Megaphone,
  Sparkles,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SIDEBAR_NAV_ITEMS } from "@/lib/constants";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Radar,
  Package,
  Target,
  Warehouse,
  Megaphone,
  Sparkles,
  BookOpen,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const { t, dir } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const isRtl = dir === "rtl";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email ?? "");
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single()
          .then(({ data: profileData }) => {
            if (profileData) setProfile(profileData);
          });
      }
    });
  }, []);

  const displayName = profile?.full_name || userEmail.split("@")[0] || "";
  const initials = displayName ? displayName.charAt(0).toUpperCase() : "?";

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  return (
    <aside
      className={cn(
        "fixed top-0 z-40 hidden h-screen border-border bg-sidebar-background transition-[width,transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] lg:flex lg:flex-col",
        isRtl ? "right-0 border-l" : "left-0 border-r",
        expanded ? "w-60" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {expanded && (
          <span className="text-lg font-bold text-sidebar-foreground">
            {t.common.appName}
          </span>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isRtl ? (
            expanded ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />
          ) : (
            expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.key}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !expanded && "justify-center"
              )}
            >
              {Icon && <Icon className="h-5 w-5 shrink-0" />}
              {expanded && <span>{t.nav[item.key as keyof typeof t.nav]}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center", expanded ? "gap-3" : "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
            <span className="text-sm font-medium">{initials}</span>
          </div>
          {expanded && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {profile?.store_name || userEmail}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            "mt-3 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
            !expanded && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {expanded && <span>{t.nav.logout}</span>}
        </button>
        <div className={cn("mt-3", expanded ? "" : "flex justify-center")}>
          <LanguageToggle />
        </div>
      </div>
    </aside>
  );
}

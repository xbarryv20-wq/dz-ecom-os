"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  LayoutDashboard,
  Radar,
  Package,
  Target,
  FileText,
  FlaskConical,
  Warehouse,
  Megaphone,
  Sparkles,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { SIDEBAR_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Radar,
  Package,
  Target,
  FileText,
  FlaskConical,
  Warehouse,
  Megaphone,
  Sparkles,
  BookOpen,
  Settings,
};

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.key}
              href={item.path}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {Icon && <Icon className="h-5 w-5" />}
              {isActive && (
                <span className="h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}

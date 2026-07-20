"use client";

import { I18nProvider, useI18n } from "@/lib/i18n/context";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { dir } = useI18n();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className="flex-1 pb-20 lg:pb-0"
        style={{ marginInlineStart: "15rem" }}
      >
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <DashboardContent>{children}</DashboardContent>
    </I18nProvider>
  );
}

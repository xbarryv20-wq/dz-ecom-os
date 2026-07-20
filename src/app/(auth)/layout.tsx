"use client";

import { I18nProvider } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/layout/language-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <div className="absolute left-4 top-4">
          <LanguageToggle />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </I18nProvider>
  );
}

"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, Target, Megaphone, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: typeof Radar;
  color: string;
  hoverColor: string;
}

export function QuickActions() {
  const { t } = useI18n();

  const actions: QuickAction[] = [
    {
      title: t.dashboard.addSignal,
      description: t.dashboard.addSignalDesc,
      href: "/signals/new",
      icon: Radar,
      color: "bg-blue-50 text-blue-600",
      hoverColor: "hover:bg-blue-100",
    },
    {
      title: t.dashboard.generateAngles,
      description: t.dashboard.generateAnglesDesc,
      href: "/angles/generate",
      icon: Target,
      color: "bg-orange-50 text-orange-600",
      hoverColor: "hover:bg-orange-100",
    },
    {
      title: t.dashboard.viewCampaigns,
      description: t.dashboard.viewCampaignsDesc,
      href: "/campaigns",
      icon: Megaphone,
      color: "bg-green-50 text-green-600",
      hoverColor: "hover:bg-green-100",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t.dashboard.quickActions}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.href} href={action.href}>
                <div
                  className={`group flex flex-col items-center rounded-xl border p-6 text-center transition-all hover:shadow-md ${action.hoverColor}`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${action.color} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{action.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <span>{t.dashboard.start}</span>
                    <ArrowLeft className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

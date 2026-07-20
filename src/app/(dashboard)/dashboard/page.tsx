"use client";

import { useMemo } from "react";
import { Header } from "@/components/layout/header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Radar, Megaphone, Package, Target } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import type {
  Signal as DbSignal,
  Campaign as DbCampaign,
  Product as DbProduct,
} from "@/types/database";

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "الآن";
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `منذ ${diffHr} ساعة`;
  const diffDay = Math.floor(diffHr / 24);
  return `منذ ${diffDay} يوم`;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const isDemo = !isSupabaseConfigured();

  const { data: dbSignals, isLoading: signalsLoading } =
    useSupabaseQuery<Record<string, unknown>>({
      table: "signals",
      orderBy: { column: "created_at", ascending: false },
      limit: 50,
      enabled: !isDemo,
    });

  const { data: dbCampaigns, isLoading: campaignsLoading } =
    useSupabaseQuery<Record<string, unknown>>({
      table: "campaigns",
      enabled: !isDemo,
    });

  const { data: dbProducts, isLoading: productsLoading } =
    useSupabaseQuery<Record<string, unknown>>({
      table: "products",
      enabled: !isDemo,
    });

  const { data: dbAngles } = useSupabaseQuery<Record<string, unknown>>({
    table: "marketing_angles",
    enabled: !isDemo,
  });

  const isLoading = !isDemo && (signalsLoading || campaignsLoading || productsLoading);

  const signals = dbSignals as unknown as DbSignal[];
  const campaigns = dbCampaigns as unknown as DbCampaign[];
  const products = dbProducts as unknown as DbProduct[];
  const angles = dbAngles as unknown as { id: string }[];

  const signalsCount = isDemo ? 1247 : signals.length;
  const activeCampaignsCount = isDemo
    ? 8
    : campaigns.filter((c) => c.status === "active").length;
  const productsReadyCount = isDemo
    ? 23
    : products.filter((p) => p.status === "ready").length;
  const anglesCount = isDemo ? 15 : angles.length;

  const activityItems = useMemo(() => {
    if (isDemo) return undefined;

    const items: {
      id: string;
      type: "signal" | "campaign" | "product" | "angle";
      title: string;
      description: string;
      timeAgo: string;
    }[] = [];

    for (const s of signals.slice(0, 5)) {
      items.push({
        id: `signal-${s.id}`,
        type: "signal",
        title: `إشارة جديدة: ${s.source}`,
        description: s.raw_text.slice(0, 80) + (s.raw_text.length > 80 ? "..." : ""),
        timeAgo: formatTimeAgo(s.created_at),
      });
    }

    for (const c of campaigns.slice(0, 3)) {
      items.push({
        id: `campaign-${c.id}`,
        type: "campaign",
        title: `حملة "${c.name}"`,
        description: `${c.platform} - ${c.messages} رسالة`,
        timeAgo: formatTimeAgo(c.created_at),
      });
    }

    for (const p of products.slice(0, 3)) {
      items.push({
        id: `product-${p.id}`,
        type: "product",
        title: `منتج: ${p.name}`,
        description: p.description.slice(0, 80) + (p.description.length > 80 ? "..." : ""),
        timeAgo: formatTimeAgo(p.created_at),
      });
    }

    return items.sort((a, b) => {
      const getDate = (item: typeof items[0]): Date => {
        if (item.id.startsWith("signal-")) {
          const match = signals.find((s) => `signal-${s.id}` === item.id);
          return new Date(match?.created_at ?? 0);
        }
        if (item.id.startsWith("campaign-")) {
          const match = campaigns.find((c) => `campaign-${c.id}` === item.id);
          return new Date(match?.created_at ?? 0);
        }
        const match = products.find((p) => `product-${p.id}` === item.id);
        return new Date(match?.created_at ?? 0);
      };
      return getDate(b).getTime() - getDate(a).getTime();
    }).slice(0, 6);
  }, [isDemo, signals, campaigns, products]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Header
        title={t.dashboard.title}
        description={t.dashboard.description}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t.dashboard.totalSignals}
          value={isLoading ? "-" : signalsCount.toLocaleString()}
          icon={Radar}
          iconColor="text-blue-600"
          trend={!isDemo ? undefined : { value: 12, label: t.dashboard.thisMonth }}
        />
        <MetricCard
          title={t.dashboard.activeCampaigns}
          value={isLoading ? "-" : activeCampaignsCount}
          icon={Megaphone}
          iconColor="text-green-600"
          trend={!isDemo ? undefined : { value: 3, label: t.dashboard.new }}
        />
        <MetricCard
          title={t.dashboard.productsReady}
          value={isLoading ? "-" : productsReadyCount}
          icon={Package}
          iconColor="text-purple-600"
          description={t.dashboard.waitForPublish}
        />
        <MetricCard
          title={t.dashboard.topAngles}
          value={isLoading ? "-" : anglesCount}
          icon={Target}
          iconColor="text-orange-600"
          trend={!isDemo ? undefined : { value: 5, label: t.dashboard.thisWeek }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ActivityFeed items={activityItems} />
        </div>
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

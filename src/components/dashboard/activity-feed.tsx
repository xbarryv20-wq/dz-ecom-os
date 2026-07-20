"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  Megaphone,
  Package,
  Target,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface ActivityItem {
  id: string;
  type: "signal" | "campaign" | "product" | "angle";
  title: string;
  description: string;
  timeAgo: string;
}

const activityData: ActivityItem[] = [
  {
    id: "1",
    type: "signal",
    title: "New Signal: Smartphone X200",
    description: "Strong sales signal detected in the Arabian Gulf market",
    timeAgo: "5 min ago",
  },
  {
    id: "2",
    type: "campaign",
    title: "Summer Sale Campaign Active",
    description: "Campaign running on 3 ad platforms",
    timeAgo: "15 min ago",
  },
  {
    id: "3",
    type: "product",
    title: "New Product Ready to Publish",
    description: "Wireless Pro Headphones - product page ready",
    timeAgo: "1 hour ago",
  },
  {
    id: "4",
    type: "angle",
    title: "New Profit Angle Discovered",
    description: "\"Save 40% vs competitors\" - expected conversion 3.2%",
    timeAgo: "2 hours ago",
  },
  {
    id: "5",
    type: "signal",
    title: "Signal: Trending Beauty Product",
    description: "FaceGlow Moisturizer - high demand in North Africa",
    timeAgo: "3 hours ago",
  },
  {
    id: "6",
    type: "campaign",
    title: "Ramadan 2026 Campaign Report",
    description: "ROAS: 4.8x | Total Sales: 45,000 DZD",
    timeAgo: "5 hours ago",
  },
];

const typeConfig = {
  signal: {
    icon: Radar,
    label: "Signal",
    color: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-50 text-blue-600",
  },
  campaign: {
    icon: Megaphone,
    label: "Campaign",
    color: "bg-green-100 text-green-700",
    iconBg: "bg-green-50 text-green-600",
  },
  product: {
    icon: Package,
    label: "Product",
    color: "bg-purple-100 text-purple-700",
    iconBg: "bg-purple-50 text-purple-600",
  },
  angle: {
    icon: Target,
    label: "Angle",
    color: "bg-orange-100 text-orange-700",
    iconBg: "bg-orange-50 text-orange-600",
  },
};

interface ActivityFeedProps {
  items?: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  const { t } = useI18n();
  const data = items ?? activityData;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{t.dashboard.recentActivity}</CardTitle>
        <Badge variant="secondary" className="text-xs">
          {data.length} {t.dashboard.updates}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      {item.title}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${config.color}`}
                    >
                      {config.label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.timeAgo}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

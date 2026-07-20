"use client";

import {
  Edit,
  Eye,
  Pause,
  Play,
  TrendingUp,
  TrendingDown,
  DollarSign,
  MessageSquare,
  ShoppingCart,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
import { CAMPAIGN_PLATFORMS, CAMPAIGN_STATUSES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";
import {
  CampaignMetricsDisplay,
  calculateMetrics,
  type CampaignMetrics,
} from "./campaign-metrics";
import type { Campaign } from "@/types/database";

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "bg-blue-600 text-white",
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
  tiktok: "bg-black text-white",
  google: "bg-blue-500 text-white",
  snapchat: "bg-yellow-400 text-black",
  whatsapp: "bg-green-600 text-white",
  other: "bg-gray-400 text-white",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof CheckCircle }
> = {
  draft: { label: "draft", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Package },
  active: { label: "active", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  paused: { label: "paused", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Pause },
  completed: { label: "completed", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle },
  cancelled: { label: "cancelled", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onViewDetails: (campaign: Campaign) => void;
  onPauseResume: (campaign: Campaign) => void;
}

export function CampaignCard({
  campaign,
  onEdit,
  onViewDetails,
  onPauseResume,
}: CampaignCardProps) {
  const { t } = useI18n();
  const platformLabel =
    CAMPAIGN_PLATFORMS.find((p) => p.key === campaign.platform)?.label ??
    campaign.platform;
  const statusConfig =
    STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.draft;
  const StatusIcon = statusConfig.icon;
  const metrics: CampaignMetrics = {
    spend: campaign.spend,
    messages: campaign.messages,
    confirmed_orders: campaign.confirmed_orders,
    delivered_orders: campaign.delivered_orders,
    cancellations: campaign.cancellations,
  };
  const derived = calculateMetrics(metrics);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={PLATFORM_COLORS[campaign.platform] ?? "bg-gray-400 text-white"}>
              {platformLabel}
            </Badge>
            <Badge variant="outline" className={statusConfig.color}>
              <StatusIcon className="h-3 w-3 ms-1" />
              {t.campaigns.statuses[statusConfig.label as keyof typeof t.campaigns.statuses] || statusConfig.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(campaign.launch_date)}
          </div>
        </div>
        <h3 className="text-base font-semibold mt-2">{campaign.name}</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="space-y-1">
            <DollarSign className="h-4 w-4 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">{formatCurrency(campaign.spend)}</p>
            <p className="text-[10px] text-muted-foreground">{t.campaigns.spend}</p>
          </div>
          <div className="space-y-1">
            <MessageSquare className="h-4 w-4 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">{campaign.messages}</p>
            <p className="text-[10px] text-muted-foreground">{t.campaigns.messages}</p>
          </div>
          <div className="space-y-1">
            <ShoppingCart className="h-4 w-4 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">{campaign.confirmed_orders}</p>
            <p className="text-[10px] text-muted-foreground">{t.campaigns.confirmedOrders}</p>
          </div>
          <div className="space-y-1">
            <Package className="h-4 w-4 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">{campaign.delivered_orders}</p>
            <p className="text-[10px] text-muted-foreground">{t.campaigns.deliveredOrders}</p>
          </div>
          <div className="space-y-1">
            <AlertTriangle className="h-4 w-4 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">{campaign.cancellations}</p>
            <p className="text-[10px] text-muted-foreground">{t.campaigns.cancellations}</p>
          </div>
        </div>

        <CampaignMetricsDisplay metrics={metrics} />

        <div className="flex flex-wrap gap-2 pt-1 border-t">
          <Button
            size="sm"
            variant="default"
            onClick={() => onEdit(campaign)}
          >
            <Edit className="h-3.5 w-3.5 ml-1" />
            {t.common.edit}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(campaign)}
          >
            <Eye className="h-3.5 w-3.5 ml-1" />
            {t.products.view}
          </Button>
          {campaign.status === "active" && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onPauseResume(campaign)}
            >
              <Pause className="h-3.5 w-3.5 ml-1" />
              {t.campaigns.statuses.paused}
            </Button>
          )}
          {campaign.status === "paused" && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onPauseResume(campaign)}
            >
              <Play className="h-3.5 w-3.5 ml-1" />
              {t.campaigns.statuses.active}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

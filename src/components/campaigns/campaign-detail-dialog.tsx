"use client";

import {
  Edit,
  DollarSign,
  MessageSquare,
  ShoppingCart,
  Package,
  AlertTriangle,
  Calendar,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatCurrency } from "@/lib/utils";
import { CAMPAIGN_PLATFORMS, CAMPAIGN_STATUSES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";
import {
  CampaignMetricsDisplay,
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

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: "draft", color: "bg-gray-100 text-gray-700 border-gray-200" },
  active: { label: "active", color: "bg-green-100 text-green-700 border-green-200" },
  paused: { label: "paused", color: "bg-amber-100 text-amber-700 border-amber-200" },
  completed: { label: "completed", color: "bg-blue-100 text-blue-700 border-blue-200" },
  cancelled: { label: "cancelled", color: "bg-red-100 text-red-700 border-red-200" },
};

interface CampaignDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onEdit: (campaign: Campaign) => void;
}

export function CampaignDetailDialog({
  open,
  onOpenChange,
  campaign,
  onEdit,
}: CampaignDetailDialogProps) {
  const { t } = useI18n();
  if (!campaign) return null;

  const platformLabel =
    CAMPAIGN_PLATFORMS.find((p) => p.key === campaign.platform)?.label ??
    campaign.platform;
  const statusConfig =
    STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.draft;

  const metrics: CampaignMetrics = {
    spend: campaign.spend,
    messages: campaign.messages,
    confirmed_orders: campaign.confirmed_orders,
    delivered_orders: campaign.delivered_orders,
    cancellations: campaign.cancellations,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={PLATFORM_COLORS[campaign.platform] ?? "bg-gray-400 text-white"}>
                {platformLabel}
              </Badge>
              <Badge variant="outline" className={statusConfig.color}>
                {t.campaigns.statuses[statusConfig.label as keyof typeof t.campaigns.statuses] || statusConfig.label}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onEdit(campaign);
              }}
            >
              <Edit className="h-3.5 w-3.5 ml-1" />
              {t.common.edit}
            </Button>
          </div>
          <DialogTitle className="mt-2 text-lg">{campaign.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-3">{t.campaigns.totalCampaigns}</h4>
            <CampaignMetricsDisplay metrics={metrics} />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t.campaigns.launchDate}:</span>
              <span className="font-medium">{formatDate(campaign.launch_date)}</span>
            </div>

            {campaign.angle_used && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">{t.campaigns.angleUsed}</span>
                </div>
                <p className="text-sm bg-muted rounded-md p-2.5 whitespace-pre-wrap" dir="auto">
                  {campaign.angle_used}
                </p>
              </div>
            )}

            {campaign.hook_used && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">{t.campaigns.hookUsed}</span>
                </div>
                <p className="text-sm bg-muted rounded-md p-2.5 whitespace-pre-wrap" dir="auto">
                  {campaign.hook_used}
                </p>
              </div>
            )}

            {campaign.notes && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">{t.common.notes}</span>
                </div>
                <p className="text-sm bg-muted rounded-md p-2.5 whitespace-pre-wrap" dir="auto">
                  {campaign.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
